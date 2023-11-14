import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const username = Cookies.get('username');

export const SettingsPassword = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      submit: null
    },
    validationSchema: Yup.object({
      password: Yup
        .string()
        .max(35 , 'Password must be at most 35 characters')
        .min(8 , 'Password must be at least 8 characters')
        .required('Password is required')
        // password must have at least one digit and at least one capital letter
        .matches(/^(?=.*\d)(?=.*[A-Z]).+$/ , 'Password must have at least one Capital Character and one Digit'),
        confirmPassword: Yup
        .string()
        .min(8 , 'Password must be at least 8 characters')
        .max(35 , 'Password must be at most 35 characters')
        .required('Confirmation Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    onSubmit: async (values, helpers) => {
      if (values.password !== values.confirmPassword) {
        console.log(123);
      }else{
        try {
        const response = await fetch('http://localhost:8000/patient/changePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            newPassword: values.password,
          }),
        });
        if (response.ok) {
          console.log('Password updated successfully');
          router.refresh();
        } else {
          console.error('Failed to update password');
        }
      } catch (error) {
        console.error('An error occurred while updating the password', error);
      }
    }
  }});

  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // Check if password and confirm match
      if (values.password !== values.confirm) {
        console.error('Passwords do not match');
        return;
      }
      
    },
    [values.password, values.confirm]
  );

  return (
    <form noValidate
    onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
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
                  <TextField
                    error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    fullWidth
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    label="Password (Confirm)"
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.confirmPassword}
                  />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
          >
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
