import React from 'react';
import { Button } from '@mui/material';

const Page = () => {
  return (
    <div
      style={{
        backgroundImage: `url("/assets/Welcome5.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row', // Adjusted to row layout
        justifyContent: 'center', // Center horizontally
        alignItems: 'flex-end', // Align to the bottom
        paddingBottom: '12rem', // Add padding to create space from the bottom
      }}
    >
      <Button
        fullWidth
        size="large"
        href="/auth/login"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontSize: '1rem',
          whiteSpace: 'nowrap', // Ensure the label stays on one line
          marginRight: '1rem', // Adjust spacing between buttons
          '&:hover': {
            backgroundColor: '#8FE2ED',
            color: 'white',
          },
          // Add maxWidth to control the width of the button
          maxWidth: '200px',
        }}
      >
        Login
      </Button>
      <Button
        fullWidth
        size="large"
        href="/auth/doctorRegister"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontSize: '1rem',
          whiteSpace: 'nowrap', // Ensure the label stays on one line
          marginRight: '1rem', // Adjust spacing between buttons
          '&:hover': {
            backgroundColor: '#8FE2ED',
            color: 'white',
          },
          // Add maxWidth to control the width of the button
          maxWidth: '200px',
        }}
      >
        Register as Doctor
      </Button>
      {/* Additional Button */}
      <Button
        fullWidth
        size="large"
        href="/auth/patientRegister"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontSize: '1rem',
          whiteSpace: 'nowrap', // Ensure the label stays on one line
          '&:hover': {
            backgroundColor: '#8FE2ED',
            color: 'white',
          },
          // Add maxWidth to control the width of the button
          maxWidth: '200px',
        }}
      >
        Register as Patient
      </Button>
    </div>
  );
};

export default Page;
