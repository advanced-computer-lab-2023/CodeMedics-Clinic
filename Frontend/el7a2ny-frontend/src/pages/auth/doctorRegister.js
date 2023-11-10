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
      Name: '',
      Username: '',
      Password: '',
      Email: '',
      DateOfBirth: '',
      HourlyRate: '',
      affiliation: '',
      Degree: '',
        Submit: null
    },
    validationSchema: Yup.object({
      Name: Yup
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
      DateOfBirth: Yup
        .date()
        .required('Date of birth is required'),
      HourlyRate: Yup
        .number()
        .required('Hourly rate is required'),
      affiliation: Yup
        .string()
        .required('Affiliation is required'),
      Degree: Yup
        .string()
        .required('Degree is required')  
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {"Name": values.Name, 
        "Username":values.Username , 
        "Password": values.Password,
        "Email": values.Email,
        "DateOfBirth": values.DateOfBirth,
        "HourlyRate": values.HourlyRate,
        "affiliation": values.affiliation,
        "Degree": values.Degree };
          await axios.post('http://localhost:8000/createPharmacist' , body)
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
          Pharmacist Register
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
                Register as Pharmacist
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
                  error={!!(formik.touched.Name && formik.errors.Name)}
                  fullWidth
                  helperText={formik.touched.Name && formik.errors.Name}
                  label="Name"
                  name="Name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Name}
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
                  error={!!(formik.touched.HourlyRate && formik.errors.HourlyRate)}
                  fullWidth
                  helperText={formik.touched.HourlyRate && formik.errors.HourlyRate}
                  label="Hourly Rate (EGP)"
                  name="HourlyRate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.HourlyRate}
                />
                <TextField
                  error={!!(formik.touched.affiliation && formik.errors.affiliation)}
                  fullWidth
                  helperText={formik.touched.affiliation && formik.errors.affiliation}
                  label="Affiliation"
                  name="affiliation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.affiliation}
                />
                <TextField
                  error={!!(formik.touched.Degree && formik.errors.Degree)}
                  fullWidth
                  helperText={formik.touched.Degree && formik.errors.Degree}
                  label="Degree"
                  name="Degree"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Degree}
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
