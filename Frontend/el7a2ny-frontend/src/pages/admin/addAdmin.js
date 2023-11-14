import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();


    setMessage('Submission successful!');
  };
  const [error, setError] = useState('');
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => { // Call the handleFormSubmit function
        axios.post('http://localhost:8000/admin/addAdmin', {
            Username: values.username,
            Password: values.password
          })
        .then((response) => {
          if (response.status === 200) {
            event.preventDefault();
            setError('');
            setMessage('Submission successful!');
          }
        })
        .then((data) => {
          router.push('/admin/admins');
        })
        .catch((error) => {
          console.log('Error:', error);
          setMessage('Username already exists. Please choose another one.');
          setError('Error occurred: ' + error.message);
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          Add a new Admin | Code-Medics Clinic
        </title>
      </Head>
      <Box
        sx={{
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
                Add a new Admin 
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
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
                style = {{ backgroundColor: 'rgba(0, 0, 255, 0.5)', color: 'black' }}
              >
                Add
              </Button>
            </form>
            <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick = {() => {
                    router.push('/admin/admins');
                }}
                variant="contained"
                style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)', color: 'black' }}
              >
                Cancel
              </Button>
            <div style={{ color: error === '' ? 'green' : 'red', fontWeight: 'bold', marginTop: '10px' }}>{message}</div>
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
