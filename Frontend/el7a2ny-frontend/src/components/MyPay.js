import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// import { paymentAxios } from '../../utils/AxiosConfig';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
const stripePromise = loadStripe('pk_test_51OA3YuHNsLfp0dKZSCi30qg6xY63jh2SiffqCIa42j0oTXnZ29hNOalf44tjkJZsjT27xldMpzbojdn6vYcEx9CI00kvtRqele');

export default function MyPay({activeStep, setStep}) {
  const [clientSecret, setClientSecret] = useState('');

 
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
     axios.post('/create-payment-intent', { })
      .then((data) => setClientSecret(data.data.clientSecret));
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
            <CheckoutForm activeStep = {activeStep} setStep = {setStep} />
          </Elements>
        )}
      </div>
  

  );
}