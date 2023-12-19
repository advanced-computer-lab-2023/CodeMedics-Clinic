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
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import Message from 'src/components/Message';

export const AddFamilyMemberInfo = () => {

  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      Email: '',
      Relation: '',
    },
    validationSchema: Yup.object({
      Email: Yup
        .string()
        .max(255)
        .required('Email or Phone Number is required'),
      Relation: Yup
        .string()
        .max(255)
        .required('Relation is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          "familyMemberEmail": values.Email,
          "relation": values.Relation
        };
        await axios('http://localhost:8000/patient/familyMembers', {
            method: 'PATCH',
            data: body,
            withCredentials: true
        })
          .then((res) => {
            if (res.status != 200) {
              throw new Error(res.data.message);
            }
            router.push('/user/family-members');
          })
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response.data.message });
        helpers.setSubmitting(false);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      }
    }
  });

  const handleClose = () => {
    setShowError(false);
    router.push('/user/family-members');
  }

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Message condition={showError} setCondition={handleClose} message={errorMessage} title="Error" buttonAction="Close" />
      <Card>
        <CardHeader
          subheader="Link a family member to your account"
          title="Add Family Member"
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
                  error={!!(formik.touched.Email && formik.errors.Email)}
                  fullWidth
                  helperText={formik.touched.Email && formik.errors.Email}
                  label="Enter Email or Phone Number"
                  name="Email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.Relation && formik.errors.Relation)}
                  fullWidth
                  helperText={formik.touched.Relation && formik.errors.Relation}
                  label="Relation"
                  name="Relation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.Relation}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

