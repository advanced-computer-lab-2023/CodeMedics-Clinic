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

export const AddFamilyMemberInfo = () => {

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      Username: '',
      Relation: '',
    },
    validationSchema: Yup.object({
      Username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      Relation: Yup
        .string()
        .max(255)
        .required('Relation is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          "familyMemberUsername": values.Username,
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
        router.push('/user/family-members');
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

