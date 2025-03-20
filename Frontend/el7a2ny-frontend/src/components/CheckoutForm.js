import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { BACKEND_ROUTE } from "src/utils/Constants";

export default function CheckoutForm({ appointmentId, patientUsername, packageName }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const route = appointmentId ? `appointments/${appointmentId}` : `health-packages/${packageName}`

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded.");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Payment failed. Please try another method.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, router]);

  const handleWalletPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `${BACKEND_ROUTE}/patients/${patientUsername}/payment/${route}`,
        { paymentMethod: "Wallet", packageName }
      );
      router.push("/patient/doctors");
    } catch (err) {
      console.log("error", err);
      setMessage(err.response.data.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/patient/doctors` },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await axios.post(
          `${BACKEND_ROUTE}/patients/${patientUsername}/payment/${route}`,
          { paymentMethod: "Card", packageName }
        );
        router.push("/patient/doctors");
      } catch (err) {
        setMessage("Payment succeeded, but failed to update the backend. Please contact support.");
        console.error("Backend update error:", err);
      }
    }

    setIsLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <form id="payment-form" onSubmit={handleStripePayment} style={{ margin: "40px" }}>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        <button
          disabled={isLoading || !stripe}
          type="submit"
          style={{
            padding: "10px 15px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#6666FF",
            color: "white",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "20px",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Processing..." : "Pay with Card"}
        </button>
        {isLoading ? null : (
          <button
            type="button"
            onClick={handleWalletPayment}
            disabled={isLoading}
            style={{
              padding: "10px 15px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "#6666FF",
              color: "white",
              borderRadius: "20px",
              cursor: "pointer",
              marginTop: "20px",
              marginLeft: "10px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            Pay with Wallet
          </button>
        )}

        {message && (
          <Typography color={message.includes("success") ? "green" : "red"} sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </form>
    </div>
  );
}
