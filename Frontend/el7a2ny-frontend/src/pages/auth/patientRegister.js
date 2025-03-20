import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import axios from "axios";
import { BACKEND_ROUTE } from "src/project-utils/constants";

const patientRegistrationSchema = Yup.object({
  firstName: Yup.string().max(255).required("First name is required"),
  lastName: Yup.string().max(255).required("Last name is required"),
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string().max(255).required("Password is required"),
  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  mobileNumber: Yup.string().max(255).required("Mobile number is required"),
  gender: Yup.string().max(255).required("Gender is required"),
  emergencyContactName: Yup.string().max(255).required("Emergency contact name is required"),
  emergencyContactNumber: Yup.string().max(255).required("Emergency contact number is required"),
  emergencyContactRelation: Yup.string()
    .max(255)
    .required("Emergency contact relation is required"),
});

const Page = () => {
  const router = useRouter();

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const formFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "mobileNumber", label: "Mobile Number", type: "text" },
    { name: "gender", label: "Gender", type: "select", options: genderOptions },
    { name: "emergencyContactName", label: "Emergency Contact Name", type: "text" },
    { name: "emergencyContactNumber", label: "Emergency Contact Number", type: "text" },
    { name: "emergencyContactRelation", label: "Emergency Contact Relation", type: "text" },
  ];

  const registerPatient = async (patientData) => {
    try {
      const response = await axios.post(`${BACKEND_ROUTE}/patients`, patientData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      dateOfBirth: "",
      mobileNumber: "",
      gender: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
      submit: null,
    },
    validationSchema: patientRegistrationSchema,
    onSubmit: async (values, helpers) => {
      const patientData = {
        FirstName: values.firstName,
        LastName: values.lastName,
        Username: values.username,
        Password: values.password,
        Email: values.email,
        DateOfBirth: values.dateOfBirth,
        Number: values.mobileNumber,
        Gender: values.gender,
        EmergencyContactName: values.emergencyContactName,
        EmergencyContactNumber: values.emergencyContactNumber,
        EmergencyContactRelation: values.emergencyContactRelation,
      };

      const result = await registerPatient(patientData);

      if (result.success) {
        router.push("/auth/login");
      } else {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: result.error });
        helpers.setSubmitting(false);
      }
    },
  });

  const renderFormField = (field) => {
    const { name, label, type, options } = field;
    const fieldName = name.split(".").pop();

    if (type === "select") {
      return (
        <TextField
          key={fieldName}
          fullWidth
          select
          label={label}
          name={fieldName}
          value={formik.values[fieldName]}
          onChange={(event) => {
            formik.setFieldValue(fieldName, event.target.value);
          }}
          error={!!(formik.touched[fieldName] && formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (type === "date") {
      return (
        <TextField
          key={fieldName}
          fullWidth
          label={label}
          name={fieldName}
          type="date"
          value={formik.values[fieldName]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched[fieldName] && formik.errors[fieldName])}
          helperText={formik.touched[fieldName] && formik.errors[fieldName]}
          InputLabelProps={{ shrink: true }}
        />
      );
    }

    return (
      <TextField
        key={fieldName}
        fullWidth
        label={label}
        name={fieldName}
        type={type}
        value={formik.values[fieldName]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched[fieldName] && formik.errors[fieldName])}
        helperText={formik.touched[fieldName] && formik.errors[fieldName]}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Patient Registration</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register as Patient</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>{formFields.map(renderFormField)}</Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 5 }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
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

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
