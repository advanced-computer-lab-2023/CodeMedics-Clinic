import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import axios from "axios";
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { BACKEND_ROUTE } from "src/project-utils/constants";

const validationSchema = Yup.object({
  firstName: Yup.string().max(255).required("First name is required"),
  lastName: Yup.string().max(255).required("Last name is required"),
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string().max(255).required("Password is required"),
  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  hourlyRate: Yup.number().required("Hourly rate is required"),
  affiliation: Yup.string().required("Affiliation is required"),
  degree: Yup.string().required("Degree is required"),
  speciality: Yup.string().required("Speciality is required"),
  nationalIdFile: Yup.mixed().required("National ID is required"),
  medicalDegreeFile: Yup.mixed().required("Medical Degree is required"),
  medicalLicenseFile: Yup.mixed().required("Medical License is required"),
});

const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      dateOfBirth: "",
      hourlyRate: "",
      affiliation: "",
      degree: "",
      speciality: "",
      nationalIdFile: null,
      medicalDegreeFile: null,
      medicalLicenseFile: null,
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));

        await axios.post(`${BACKEND_ROUTE}/doctors`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        router.push("/auth/login");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ Submit: err.response?.data?.message || "Registration failed" });
        helpers.setSubmitting(false);
      }
    },
  });

  const renderFileInput = (name, label) => (
    <label htmlFor={name}>
      <Button
        component="span"
        fullWidth
        size="medium"
        sx={{ mt: 3, backgroundColor: "#F8F8F8", "&:hover": { backgroundColor: "#F1F1F1" } }}
        endIcon={<DocumentArrowUpIcon />}
      >
        {label}
      </Button>
      <input
        id={name}
        name={name}
        type="file"
        accept=".jpg, .jpeg, .png, .pdf"
        onChange={(event) => formik.setFieldValue(name, event.currentTarget.files[0])}
        style={{ display: "none" }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formik.errors[name]}
        </Typography>
      )}
      {formik.values[name] && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {formik.values[name].name}
        </Typography>
      )}
    </label>
  );

  return (
    <>
      <Head>
        <title>Doctor Register</title>
      </Head>
      <Box
        sx={{ flex: "1 1 auto", alignItems: "center", display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Register as Doctor</Typography>
            <Typography color="text.secondary" variant="body2">
              Already have an account?&nbsp;
              <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                Log in
              </Link>
            </Typography>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Stack spacing={3}>
              {[
                "firstName",
                "lastName",
                "username",
                "password",
                "email",
                "dateOfBirth",
                "hourlyRate",
                "affiliation",
                "degree",
                "speciality",
              ].map((field) => (
                <TextField
                  key={field}
                  error={!!(formik.touched[field] && formik.errors[field])}
                  fullWidth
                  helperText={formik.touched[field] && formik.errors[field]}
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  name={field}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values[field]}
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : field === "dateOfBirth"
                      ? "date"
                      : "text"
                  }
                  InputLabelProps={field === "dateOfBirth" ? { shrink: true } : {}}
                />
              ))}
              {renderFileInput("nationalIdFile", "Upload National ID")}
              {renderFileInput("medicalDegreeFile", "Upload Medical Degree")}
              {renderFileInput("medicalLicenseFile", "Upload Medical License")}
            </Stack>
            {formik.errors.Submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.Submit}
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
