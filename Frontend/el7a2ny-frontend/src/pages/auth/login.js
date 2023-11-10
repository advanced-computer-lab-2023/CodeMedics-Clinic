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

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('Username');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')  
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
          const body = {"email": values.email, "password": values.password};
          await axios.post('http://localhost:8000/login' , body)
            .then((res) => { 
              console.log(res);
              return res['data'];
            })
            .then((data) => {
              if (data['Type'] === 'Patient') {
                Cookies.set('username', data['patient']['username']);
                router.push(`/user/medicines`);
              } else if (data['Type'] === 'Pharmacist') {
                Cookies.set('username', data['pharmacist']['username']);
                router.push(`/pharmacist`);
              } else if (data['Type'] === 'Admin') {
                Cookies.set('username', data['admin']['username']);
                router.push(`/admin`);
              }
            });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const LoginWithUsername = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {"username": values.username, "password": values.password};
          await axios.post('http://localhost:8000/login' , body)
            .then((res) => { 
              if(res.status != 200){
                console.log(res.status);
                throw new Error(res.data.message);
              }
              return res['data'];
            })
            .then((data) => {              
              if (data['Type'] === 'Patient') {
                Cookies.set('username', data['patient']['Username']);
                router.push(`/user/medicines`);
              } else if (data['Type'] === 'Pharmacist') {
                Cookies.set('username', data['pharmacist']['username']);
                router.push(`/pharmacist`);
              } else if (data['Type'] === 'Admin') {
                Cookies.set('username', data['admin']['username']);
                router.push(`/admin`);
              }
            });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.message });
        helpers.setSubmitting(false);
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
          Login
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
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
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account? Register as
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/pharmacistRegister"
                  underline="hover"
                  variant="subtitle2"
                >
                  Pharmacist
                </Link>
                &nbsp; , &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/patientRegister"
                  underline="hover"
                  variant="subtitle2"
                >
                  Patient
                </Link>
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Username"
                value="Username"
              />
              <Tab
                label="Email"
                value="email"
              />
            </Tabs>
            {method === 'email' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  // onClick={handleSkip}
                >
                  Forgot Password?
                </Button>
                {/* <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert> */}
              </form>
            )}
            {method === 'Username' && (
              <form
                noValidate
                onSubmit={LoginWithUsername.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(LoginWithUsername.touched.username && LoginWithUsername.errors.username)}
                    fullWidth
                    helperText={LoginWithUsername.touched.username && LoginWithUsername.errors.username}
                    label="Username"
                    name="username"
                    onBlur={LoginWithUsername.handleBlur}
                    onChange={LoginWithUsername.handleChange}
                    type="username"
                    value={LoginWithUsername.values.username}
                  />
                  <TextField
                    error={!!(LoginWithUsername.touched.password && LoginWithUsername.errors.password)}
                    fullWidth
                    helperText={LoginWithUsername.touched.password && LoginWithUsername.errors.password}
                    label="Password"
                    name="password"
                    onBlur={LoginWithUsername.handleBlur}
                    onChange={LoginWithUsername.handleChange}
                    type="password"
                    value={LoginWithUsername.values.password}
                  />
                </Stack>
                {LoginWithUsername.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {LoginWithUsername.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  // onClick={handleSkip}
                >
                  Forgot Password?
                </Button>
                {/* <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert> */}
              </form>
            )}
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
