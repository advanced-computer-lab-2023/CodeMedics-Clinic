import { useState, useCallback } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { BACKEND_ROUTE } from "src/project-utils/constants";

const Page = () => {
  const router = useRouter();
  const [otpNum, setOtpNum] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const usernameFormik = useFormik({
    initialValues: { username: "" },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required("Username is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { data } = await axios.post(`${BACKEND_ROUTE}/resetPassword`, values, {
          withCredentials: true,
        });
        console.log("OTP", data.OTP);
        setOtpNum(data.OTP);
        setAlertVisible(true);
        setCategory(data.category);
      } catch (err) {
        helpers.setErrors({ submit: err.response?.data?.message || "An error occurred" });
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
    }),
    onSubmit: (values) => {
      if (values.otp === otpNum?.toString()) {
        router.replace(`/auth/resetPassword?username=${usernameFormik.values.username}&category=${category}`);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <Box sx={{ maxWidth: 550, p: 3, width: "100%" }}>
          {alertVisible && (
            <Alert onClose={() => setAlertVisible(false)} severity="success">
              OTP sent successfully to your email
            </Alert>
          )}

          <Typography variant="h4" sx={{ mb: 3 }}>
            Forgot Password
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              disabled={!!otpNum}
              {...usernameFormik.getFieldProps("username")}
              error={usernameFormik.touched.username && Boolean(usernameFormik.errors.username)}
              helperText={usernameFormik.touched.username && usernameFormik.errors.username}
            />

            {otpNum && (
              <TextField
                label="Enter OTP"
                name="otp"
                {...otpFormik.getFieldProps("otp")}
                error={otpFormik.touched.otp && Boolean(otpFormik.errors.otp)}
                helperText={otpFormik.touched.otp && otpFormik.errors.otp}
              />
            )}
          </Stack>

          {usernameFormik.errors.submit && (
            <Typography color="error" sx={{ mt: 2 }}>
              {usernameFormik.errors.submit}
            </Typography>
          )}

          <form onSubmit={otpNum ? otpFormik.handleSubmit : usernameFormik.handleSubmit}>
            <Button fullWidth sx={{ mt: 3 }} type="submit" variant="contained">
              {otpNum ? "Reset Password" : "Continue"}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
