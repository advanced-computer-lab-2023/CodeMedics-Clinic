import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Message from "src/components/Miscellaneous/Message";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { BACKEND_ROUTE } from "src/utils/Constants";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState({ show: false, message: "" });

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "At least 8 characters")
        .max(35, "At most 35 characters")
        .matches(/^(?=.*\d)(?=.*[A-Z]).+$/, "Must include 1 capital letter & 1 digit")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirmation is required"),
    }),
    onSubmit: async (values) => {
      try {
        const username = new URLSearchParams(window.location.search).get("username");
        const category = new URLSearchParams(window.location.search).get("category");
        const response = await fetch(`${BACKEND_ROUTE}/${category}/${username}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password: values.password }),
        });

        if (!response.ok) throw new Error("Failed to update password");

        router.push("/auth/login");
      } catch (err) {
        setError({ show: true, message: err.message || "An error occurred" });
      }
    },
  });

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <Message
        condition={error.show}
        setCondition={() => setError({ ...error, show: false })}
        title="Error"
        message={error.message}
        buttonAction="Close"
      />

      <Box
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: "1 1 auto",
        }}
      >
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Reset your password</Typography>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...formik.getFieldProps("password")}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                {...formik.getFieldProps("confirmPassword")}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Reset
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

ResetPasswordPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default ResetPasswordPage;
