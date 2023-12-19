import React, { useState, useEffect } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box } from '@mui/system';
import { Container, Grid, Typography, Stack, Card } from '@mui/material';
import CheckoutForm from './CheckoutForm';
import Message from 'src/components/Message';

const stripePromise = loadStripe('pk_test_51OA3YuHNsLfp0dKZSCi30qg6xY63jh2SiffqCIa42j0oTXnZ29hNOalf44tjkJZsjT27xldMpzbojdn6vYcEx9CI00kvtRqele');

const Page = () => {
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();
  const { appointmentId, patientUsername } = router.query;
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios.post('http://localhost:8000/create-payment-intent?amount=100', {})
      .then((data) => setClientSecret(data.data.clientSecret))
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
      <Box
        component="main"
        backgroundColor="linear-gradient(to bottom, #FFFFFF, #000000)"
        sx={{
          pt: 8,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center', // Horizontal centering
          alignItems: 'center',     // Vertical centering
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h3" >
            Appointment Payment
          </Typography>
          <Card sx={{height: 360 , backgroundColor: "#d9dee4"}}>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm appointmentId={appointmentId} patientUsername={patientUsername} />
              </Elements>
            )}
          </Card>
        </Stack>
      </Box >
    </>
  );
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;