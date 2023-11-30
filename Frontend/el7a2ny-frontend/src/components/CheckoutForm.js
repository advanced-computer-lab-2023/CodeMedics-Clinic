import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
export default function CheckoutForm({activeStep, setStep}) {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const username = Cookies.get('username');
  const [isDone, setIsDone] = useState(false);
  const [isPatched, setIsPatched] = useState(false);
  useEffect(() => {
    if (isDone) {
      axios.patch(`http://localhost:8000/patient/bookAppointment?appointmentId=${appointment._id}&patientUsername=${Cookies.get('username')}`)
      setIsPatched(true);
    }
  }
  , [isDone]);

  useEffect(() => {
    if (isPatched) {
      router.push(`/user/doctors`);
    }
  }
  , [isPatched]);

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
        return_url: window.location.href
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
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
  disabled={isLoading || !stripe || !elements}
  id="submit"
  style={{
    padding: '10px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#6666FF', // Light Blue color
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  }}
>
  <span id="button-text">
    {isLoading ? <div className="spinner" id="spinner" ></div> : "Pay Order"}
  </span>
</button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}