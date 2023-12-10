import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// import { paymentAxios } from '../../utils/AxiosConfig';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import { useRouter } from 'next/router';
const stripePromise = loadStripe('pk_test_51OA3YuHNsLfp0dKZSCi30qg6xY63jh2SiffqCIa42j0oTXnZ29hNOalf44tjkJZsjT27xldMpzbojdn6vYcEx9CI00kvtRqele');

export default function MyPay({activeStep, setStep}) {
  const [clientSecret, setClientSecret] = useState('');

  const router = useRouter();
  const { appointmentId, patientUsername} = router.query;
  useEffect(() => {
    console.log('MyPay.js was here')
    // Create PaymentIntent as soon as the page loads
     axios.post('http://localhost:8000/create-payment-intent?amount=100', { })
      .then((data) => setClientSecret(data.data.clientSecret)).catch((error) => {
        console.log(error);
      }
      );
  }, []);




  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    
      <div className='MyPay'>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm appointmentId = {appointmentId} patientUsername = {patientUsername} />
          </Elements>
        )}
      </div>
  

  );
}