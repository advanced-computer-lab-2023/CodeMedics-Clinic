import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Unstable_Grid2 as Grid
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';

export const AccountProfileDetails = ({ values, setValues }) => {

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Username: values.Username,
      Password: '',
      Email: values.Email,
      Number: values.Number,
      DateOfBirth: values.DateOfBirth,
      HourlyRate: values.HourlyRate,
      affiliation: values.affiliation,
      Degree: values.Degree,
      Speciality: values.Speciality,
      Wallet: values.Wallet,
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
        .max(255),
      Email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      DateOfBirth: Yup
        .date()
        .required('Date of birth is required'),
      HourlyRate: Yup
        .string()
        .max(255)
        .required('Hourly Rate is required'),
      affiliation: Yup
        .string()
        .max(255)
        .required('Affiliation is required'),
      Degree: Yup
        .string()
        .max(255)
        .required('Degree is required'),
      Speciality: Yup
        .string()
        .max(255)
        .required('Speciality is required'),
      Wallet: Yup
        .string()
        .max(255)
        .required('Wallet is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          "FirstName": values.FirstName,
          "LastName": values.LastName,
          "Username": values.Username,
          "Password": values.Password,
          "Email": values.Email,
          "DateOfBirth": values.DateOfBirth,
          "HourlyRate": values.HourlyRate,
          "affiliation": values.affiliation,
          "Degree": values.Degree,
          "Speciality": values.Speciality,
        };
        await axios('http://localhost:8000/patient/updateMe', {
            method: 'PATCH',
            data: body,
            withCredentials: true
        })
          .then((res) => {
            if (res.status != 200) {
              throw new Error(res.data.message);
            }
            return res['data'];
          })
          .then((data) => {
            router.push('/auth/login');
          });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    }
  });
  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
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
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
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
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
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
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
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
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!( formik.touched.affiliation && formik.errors.affiliation)}
                  fullWidth
                  helperText={ formik.touched.affiliation && formik.errors.affiliation}
                  label="Affiliation"
                  name="affiliation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.affiliation}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.HourlyRate && formik.errors.HourlyRate)}
                  fullWidth
                  helperText={formik.touched.HourlyRate && formik.errors.HourlyRate}
                  label="Hourly Rate"
                  name="Number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.HourlyRate}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
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
              </Grid>              
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.Degree && formik.errors.Degree)}
                  fullWidth
                  helperText={formik.touched.Degree  && formik.errors.Degree}
                  label="Education Degree"
                  name="degree"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Degree}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.Speciality && formik.errors.Speciality)}
                  fullWidth
                  helperText={formik.touched.Speciality && formik.errors.Speciality}
                  label="Speciality"
                  name="Speciality"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Speciality}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
