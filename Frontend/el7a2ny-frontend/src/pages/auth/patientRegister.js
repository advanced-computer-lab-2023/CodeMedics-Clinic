import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import axios from 'axios';
//import { error } from 'console';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      FirstName: '',
      LastName: '',
      Username: '',
      Password: '',
      Email: '',
      NationalID: '',
      DateOfBirth: '',
      Number: '',
      Gender: ''
    },
    validationSchema: Yup.object({
      FirstName: Yup
        .string()
        .max(255)
        .required('Name is required'),
      LastName: Yup
        .string()
        .max(255)
        .required('Name is required'),
      Username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      Password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      Email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      NationalID: Yup
      .string()
      .max(255)
      .required('National ID is required'),
      DateOfBirth: Yup
        .date()
        .required('Date of birth is required'),
      Number: Yup
      .string()
      .max(255)
      .required('Phone number is required'),
      Gender: Yup
      .string()
      .max(255)
      .required('Gender is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {"FirstName": values.FirstName,
        "LastName": values.LastName, 
        "Username":values.Username , 
        "Password": values.Password,
        "Email": values.Email,
        "NationalID": values.NationalID,
        "DateOfBirth": values.DateOfBirth,
        "Number": values.Number,
        "Gender": values.Gender };
          await axios.post('http://localhost:8000/addUser' , body)
          .then((res) => { 
            if(res.status != 200){
              throw new Error(res.data.message); 
            }
              return res['data'];
            })
            .then((data) => {
              router.push('/auth/login');
            });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response.data.error});
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Patient Register
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
                Register as Patient
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.FirstName && formik.errors.FirstName)}
                  fullWidth
                  helperText={formik.touched.FirstName && formik.errors.FirstName}
                  label="FirstName"
                  name="FirstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.FirstName}
                />
                <TextField
                  error={!!(formik.touched.LastName && formik.errors.LastName)}
                  fullWidth
                  helperText={formik.touched.LastName && formik.errors.LastName}
                  label="LastName"
                  name="LastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.LastName}
                />
                <TextField
                  error={!!(formik.touched.Username && formik.errors.Username)}
                  fullWidth
                  helperText={formik.touched.Username && formik.errors.Username}
                  label="Username"
                  name="Username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Username}
                />
                <TextField
                  error={!!(formik.touched.Password && formik.errors.Password)}
                  fullWidth
                  helperText={formik.touched.Password && formik.errors.Password}
                  label="Password"
                  name="Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.Password}
                />
                <TextField
                  error={!!(formik.touched.Email && formik.errors.Email)}
                  fullWidth
                  helperText={formik.touched.Email && formik.errors.Email}
                  label="Email Address"
                  name="Email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.Email}
                />
                <TextField
                  error={!!(formik.touched.NationalID && formik.errors.NationalID)}
                  fullWidth
                  helperText={formik.touched.NationalID && formik.errors.NationalID}
                  label="National ID"
                  name="NationalID"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.NationalID}
                />
                <TextField
                  error={!!(formik.touched.DateOfBirth && formik.errors.DateOfBirth)}
                  fullWidth
                  helperText={formik.touched.DateOfBirth && formik.errors.DateOfBirth}
                  label="Date of Birth"
                  name="DateOfBirth"
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 10) { // Limit the total length to 10 characters
                    // Allow only digits (0-9) in the "yyyy" part
                    const yyyy = value.slice(0, 4).replace(/[^0-9]/g, '');

                    // Ensure "mm" and "dd" are not affected
                    const mmdd = value.slice(4);

                    // Combine the parts and format
                    const formattedValue = `${yyyy}${mmdd}`;

                    // Update the formik value
                    formik.setFieldValue("DateOfBirth", formattedValue);
                  }
                }}
                  type="date"
                  value={formik.values.DateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  error={!!(formik.touched.Number && formik.errors.Number)}
                  fullWidth
                  helperText={formik.touched.Number && formik.errors.Number}
                  label="Mobile Number"
                  name="Number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Number}
                />
                <TextField
                  error={!!(formik.touched.Gender && formik.errors.Gender)}
                  fullWidth
                  helperText={formik.touched.Gender && formik.errors.Gender}
                  label="Gender"
                  name="Gender"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Gender}
                />
              </Stack>
              {formik.errors.Submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.Submit}
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
            </form>
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
