import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import axios from "axios";
import { BACKEND_ROUTE } from "src/project-utils/constants";

const validationSchema = Yup.object({
  firstName: Yup.string().max(255).required("First name is required"),
  lastName: Yup.string().max(255).required("Last name is required"),
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[!@#$%^&*]/, "Must contain a special character")
    .required("Password is required"),
  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  number: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Mobile number is required"),
  gender: Yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  emergencyContactName: Yup.string().max(255).required("Emergency contact name is required"),
  emergencyContactNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid emergency contact number")
    .required("Emergency contact number is required"),
  emergencyContactRelation: Yup.string()
    .max(255)
    .required("Emergency contact relation is required"),
});

const formFields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "number", label: "Mobile Number", type: "text" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
  },
  { name: "emergencyContactName", label: "Emergency Contact Name", type: "text" },
  { name: "emergencyContactNumber", label: "Emergency Contact Number", type: "text" },
  { name: "emergencyContactRelation", label: "Emergency Contact Relation", type: "text" },
];

const FormField = ({ field, formik }) => {
  const { name, label, type, options } = field;

  if (type === "select") {
    return (
      <TextField
        key={name}
        fullWidth
        select
        label={label}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        error={!!(formik.touched[name] && formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      key={name}
      fullWidth
      label={label}
      name={name}
      type={type}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={!!(formik.touched[name] && formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      InputLabelProps={type === "date" ? { shrink: true } : {}}
    />
  );
};

const Page = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      dateOfBirth: "",
      number: "",
      gender: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelation: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        console.log("posting");
        await axios.post(`${BACKEND_ROUTE}/patients`, values);
        router.push("/auth/login");
      } catch (error) {
        console.log("error", error.message);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.response?.data?.message || "Registration failed." });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Patient Registration</title>
      </Head>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
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
            <Stack spacing={3}>
              {formFields.map((field) => (
                <FormField key={field.name} field={field} formik={formik} />
              ))}
            </Stack>
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
              startIcon={formik.isSubmitting && <CircularProgress size={20} />}
              onClick={() => {
                console.log("submitting", formik.isSubmitting, formik.values);
              }}
            >
              {formik.isSubmitting ? "Registering..." : "Continue"}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
