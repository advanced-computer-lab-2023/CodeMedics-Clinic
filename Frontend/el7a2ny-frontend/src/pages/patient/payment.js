import React, { useState, useEffect } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box } from "@mui/system";
import { Typography, Stack, Card } from "@mui/material";
import CheckoutForm from "./CheckoutForm";
import Message from "src/components/Miscellaneous/Message";
const STRIPE_KEY =
  "pk_test_51OA3YuHNsLfp0dKZSCi30qg6xY63jh2SiffqCIa42j0oTXnZ29hNOalf44tjkJZsjT27xldMpzbojdn6vYcEx9CI00kvtRqele";
const stripePromise = loadStripe(STRIPE_KEY);

const Page = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { appointmentId, packageName, patientUsername } = router.query;

  useEffect(() => {
    axios
      .post("http://localhost:8000/payment/payment-intent", { appointmentId, packageName, currency: "EGP" })
      .then((response) => {
        console.log(response);
        setClientSecret(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  const appearance = {
    theme: "stripe"
  };

  const options = {
    clientSecret,
    appearance,
  };

  console.log("in the payment", clientSecret, options, stripePromise);

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={errorMessage}
        buttonAction={"Close"}
      />
      <Box
        component="main"
        backgroundColor="linear-gradient(to bottom, #FFFFFF, #000000)"
        sx={{
          pt: 8,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h3">{appointmentId ? "Appointment" : "Package"} Payment</Typography>
          <Card sx={{ backgroundColor: "#d9dee4" }}>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm appointmentId={appointmentId} patientUsername={patientUsername} packageName={packageName} />
              </Elements>
            )}
          </Card>
        </Stack>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
