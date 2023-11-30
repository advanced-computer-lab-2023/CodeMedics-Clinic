import { useCallback, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { set } from 'lodash';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [flag , setFlag] = useState(true);
  const [otpNum , setOtpNum] = useState(0);
  const [alert , setAlert] = useState(false);

  const username = useFormik({
    initialValues: {
      username: '',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required'),
    }),
    onSubmit: async (values, helpers) => {
        if(flag){
      try {
        const body = {"username": values.username};
          await axios('http://localhost:8000/resetPassword' , {
            method: 'POST',
            data: body,
            withCredentials: true,
          })
            .then((res) => { 
                setOtpNum(res.data.OTP);
                setFlag(false);
                setAlert(true);
              return res.data;
            });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    }
    }
  });

  const otp = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
        otp: Yup
        .string()
        .max(6 , 'OTP must be 6 digits')
        .min(6 , 'OTP must be 6 digits')
        .required('OTP is required'),
    }),
    onSubmit: async (values, helpers) => {
        if(!flag){
            if(values.otp == otpNum.toString()){
                router.replace(`/auth/resetPassword?username=${username.values.username}`);
            }
        }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  const handleSkip = useCallback(
    () => {
      auth.skip();
      router.push('/');
    },
    [auth, router]
  );

  return (
    <>
      <Head>
        <title>
          Forgot Password
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
            {alert && <Alert onClose={() => {setAlert(false);}} severity="success" style={{ backgroundColor: '#edf7ed'}}>OTP sent successfully to your email</Alert>}
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 ,mt: 10}}
            >
              <Typography variant="h4">
              Forgot Password
              </Typography>
            </Stack>
                <Stack spacing={3}>
                  <TextField
                    error={!!(username.touched.username && username.errors.username)}
                    fullWidth
                    helperText={username.touched.username && username.errors.username}
                    label="Username"
                    name="username"
                    disabled={!flag}
                    onBlur={username.handleBlur}
                    onChange={username.handleChange}
                    type="text"
                    value={username.values.username}
                  />
                  <TextField
                    error={!!(otp.touched.otp && otp.errors.otp)}
                    fullWidth
                    helperText={otp.touched.otp && otp.errors.otp}
                    label="Enter OTP"
                    disabled={flag}
                    name="otp"
                    onBlur={otp.handleBlur}
                    onChange={otp.handleChange}
                    type="text"
                    value={otp.values.otp}
                  />
                </Stack>
                {username.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {username.errors.submit}
                  </Typography>
                )}
                {flag &&
                <form
                noValidate
                onSubmit={username.handleSubmit}
                >
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
                </form>
                }

                {!flag &&
                <form
                    noValidate
                    onSubmit={otp.handleSubmit}
                >
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Reset
                </Button>
                </form>
                }
            

                {/* <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert> */}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
