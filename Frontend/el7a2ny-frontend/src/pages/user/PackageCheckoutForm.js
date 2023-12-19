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
import { set } from "lodash";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
export default function PackageCheckoutForm({ packageName, packagePrice, setMessage2, setInvalidAction }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const temp = (Number)(packagePrice);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const username = Cookies.get("username");
  const [isDone, setIsDone] = useState(false);
  const [isPosted, setIsPosted] = useState(false);


  useEffect(() => {
    if (isDone) {
      console.log("ISDONE", isDone);
      axios(`http://localhost:8000/patient/subscribeHealthPackage`, {
        method: 'POST',
        data: { membership: packageName },
        withCredentials: true
      })
        .then((res) => {

        })
        .catch((err) => {
          console.log(err);
        });
      setIsPosted(true);
    }
  }, [isDone]);

  useEffect(() => {
    if (isPosted) {
      window.location.href = "http://localhost:3000/user/packages";
    }
  }, [isPosted]);

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
      console.log("STATUS: ", paymentIntent.status);
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
  const [isPatched, setIsPatched] = useState(false);
  const handlePayUsingWallet = async (e) => {
    e.preventDefault();
    axios('http://localhost:8000/patient/payWithWalletPackage', {
      method: 'PATCH',
      data: { membership: packageName },
      withCredentials: true
    })
      .then((res) => {
        console.log(res.data);
        setIsDone(true);
      })
      .catch((err) => {
        setInvalidAction(true);
        setMessage2(err.response.data.message);
        console.log(err.response.data.message);
      });
  }

  useEffect(() => {
    if (isPatched) {
      router.push('/user/packages');
    }
  }
    , [isPatched]);
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
        height: "100vh",
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
        <PaymentElement id="payment-element" options={paymentElementOptions} style={{ fontSize: "20px", marginBottom: "20px" }} />
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          variant="contained"
          style={{
            padding: "10px 15px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#6666FF", // Light Blue color
            color: "white",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background-color 0.3s",
          }}
        >
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay using card"}
        </button>
        {!isLoading && (
          <button variant="contained" style={{
            padding: "10px 15px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#6666FF", // Light Blue color
            color: "white",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "20px", // Adjust marginTop as needed
            marginLeft: "10px",
            transition: "background-color 0.3s",
          }}

            onClick={handlePayUsingWallet}
          >
            Pay using wallet
          </button>
        )}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
    
  );
}
