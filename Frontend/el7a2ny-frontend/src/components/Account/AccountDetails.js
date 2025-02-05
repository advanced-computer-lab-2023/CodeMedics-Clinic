import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { patientUpdateRoute } from "src/project-utils/Constants";

function AccountDetails({ user }) {

  const formik = useFormik({
    initialValues: {
      FirstName: user.FirstName,
      LastName: user.LastName,
      Username: user.Username,
      Email: user.Email,
      Number: user.Number,
      DateOfBirth: user.DateOfBirth,
      EmergencyContactName: user.EmergencyContact.Name,
      EmergencyContactNumber: user.EmergencyContact.Number,
      EmergencyContactRelation: user.EmergencyContact.Relation,
    },
    validationSchema: Yup.object({
      FirstName: Yup.string().max(255).required("Name is required"),
      LastName: Yup.string().max(255).required("Name is required"),
      Username: Yup.string().max(255).required("Username is required"),
      Email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      DateOfBirth: Yup.date().required("Date of birth is required"),
      Number: Yup.string().max(255).required("Number is required"),
      EmergencyContactName: Yup.string().max(255).required("Name is required"),
      EmergencyContactNumber: Yup.string().max(255).required("Number is required"),
      EmergencyContactRelation: Yup.string().max(255).required("Relation is required"),
    }),
    onSubmit: async (user, helpers) => {
      try {
        const body = {
          FirstName: user.FirstName,
          LastName: user.LastName,
          Username: user.Username,
          Email: user.Email,
          DateOfBirth: user.DateOfBirth,
          Number: user.Number,
          Gender: user.Gender,
          EmergencyContact: {
            Name: user.EmergencyContactName,
            Number: user.EmergencyContactNumber,
            Relation: user.EmergencyContactRelation,
          },
        };
        await axios(patientUpdateRoute, {
          method: "PATCH",
          data: body,
          withCredentials: true,
        })
          .then((res) => {
            if (res.status != 200) {
              throw new Error(res.data.message);
            }
            return res["data"];
          })
          .then((data) => {
            window.location.reload();
          });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    },
  });
  return (
    <div>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
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
                <Grid xs={12} md={6}>
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
                <Grid xs={12} md={6}>
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
                <Grid xs={12} md={6}>
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
                <Grid xs={12} md={6}>
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
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={!!(formik.touched.DateOfBirth && formik.errors.DateOfBirth)}
                    fullWidth
                    helperText={formik.touched.DateOfBirth && formik.errors.DateOfBirth}
                    label="Date of Birth"
                    name="DateOfBirth"
                    onBlur={formik.handleBlur}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.length <= 10) {
                        const yyyy = value.slice(0, 4).replace(/[^0-9]/g, "");
                        const mmdd = value.slice(4);
                        const formattedValue = `${yyyy}${mmdd}`;
                        formik.setFieldValue("DateOfBirth", formattedValue);
                      }
                    }}
                    type="date"
                    value={formik.values.DateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={
                      !!(formik.touched.EmergencyContactName && formik.errors.EmergencyContactName)
                    }
                    fullWidth
                    helperText={
                      formik.touched.EmergencyContactName && formik.errors.EmergencyContactName
                    }
                    label="Emergency Contact Name"
                    name="EmergencyContactName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.EmergencyContactName}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={
                      !!(
                        formik.touched.EmergencyContactNumber &&
                        formik.errors.EmergencyContactNumber
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.EmergencyContactNumber && formik.errors.EmergencyContactNumber
                    }
                    label="Emergency Contact Number"
                    name="EmergencyContactNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.EmergencyContactNumber}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={
                      !!(
                        formik.touched.EmergencyContactRelation &&
                        formik.errors.EmergencyContactRelation
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.EmergencyContactRelation &&
                      formik.errors.EmergencyContactRelation
                    }
                    label="Emergency Contact Relation"
                    name="EmergencyContactRelation"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.EmergencyContactRelation}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </CardActions>
        </Card>
      </form>
      <br />
    </div>
  );
}
export default AccountDetails;
