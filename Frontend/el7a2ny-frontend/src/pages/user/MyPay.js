import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box } from '@mui/system';
import { Container, Grid, Typography } from '@mui/material';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51OA3YuHNsLfp0dKZSCi30qg6xY63jh2SiffqCIa42j0oTXnZ29hNOalf44tjkJZsjT27xldMpzbojdn6vYcEx9CI00kvtRqele');

export default function MyPay({ activeStep, setStep }) {
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();
  const { appointmentId, patientUsername } = router.query;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios.post('http://localhost:8000/create-payment-intent?amount=100', {})
      .then((data) => setClientSecret(data.data.clientSecret))
      .catch((error) => {
        console.log(error);
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
      <Box
        component="main"
        backgroundColor="linear-gradient(to bottom, #FFFFFF, #000000)"
        sx={{
          flexGrow: 1,
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" gutterBottom>
            Appointment Payment
          </Typography>
          <Grid container spacing={10} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <div className='MyPay'>
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm appointmentId={appointmentId} patientUsername={patientUsername} />
                  </Elements>
                )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
