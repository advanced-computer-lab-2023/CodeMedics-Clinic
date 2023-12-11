import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function CheckoutForm({ appointmentId, patientUsername }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const username = Cookies.get("username");
  const [isDone, setIsDone] = useState(false);
  const [isPatched, setIsPatched] = useState(false);

  useEffect(() => {
    if (isDone) {
      axios.patch(
        `http://localhost:8000/patient/bookAppointment?appointmentId=${appointmentId}&patientUsername=${patientUsername}`
      ).catch((err) => {
        console.log(err);
      })
      setIsPatched(true);
    }
  }, [isDone]);

  const handlePayUsingWallet = async (e) => {
    e.preventDefault();
    axios('http://localhost:8000/patient/payWithWallet', {
      method: 'PATCH',
      withCredentials: true,
      data: {
        AppointmentId: appointmentId,
      }
    }).then((res) => {
      console.log(res);
      setIsPatched(true);
      setMessage("Payment succeeded!");
    }).catch((err) => {
      console.log(err);
      setMessage("Your payment was not successful, please try again.");
    })
  };

  useEffect(() => {
    if (isPatched) {
      router.push(`/user/doctors`);
    }
  }, [isPatched]);





  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent.status);
      switch (paymentIntent.status) {
        case "succeeded":
          {
            setIsDone(true);
            setMessage("Payment succeeded!");
          }
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // return_url: "http://localhost:3000/user/orders"
        return_url: window.location.href,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    console.log(error.type);
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };


  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "120vh",
      }}
    >
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        style={{
          width: "400px", // Adjust the width as needed
          height: "500px", // Adjust the height as needed
          margin: "40px", // Increase the margin
        }}
      >
        <PaymentElement id="payment-element" options={paymentElementOptions} style={{ fontSize: "20px", marginBottom: "20px", }} />
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          variant="contained"
          style={{
            padding: "10px 15px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#6666FF",
            color: "white",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background-color 0.3s",
          }}
        >
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay Order"}
        </button>
        {!isLoading && (
          <Button variant="contained" style={{
            padding: "10px 15px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#6666FF", // Light Blue color
            color: "white",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "20px", // Adjust marginTop as needed
            transition: "background-color 0.3s",
          }}

            onClick={handlePayUsingWallet}
          >
            Pay using my Wallet
          </Button>
        )}
        {message && <div id="payment-message">{message}</div>}
      </form>

    </div>
  );
}
