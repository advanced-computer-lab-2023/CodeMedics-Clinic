import axios from "axios";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import socket from "src/components/socket";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { BACKEND_ROUTE } from "src/project-utils/constants";

const usernameLoginSchema = Yup.object({
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const handleUserLogin = (data, router) => {
  const setupSocketConnection = (username) => {
    socket.on("me", (id) => {
      Cookies.set("socketId", id);
    });
    socket.emit("iAmReady", username);
  };

  if (data.Type === "Patient") {
    Cookies.set("username", data.patient.username);
    Cookies.set("type", "patient");
    setupSocketConnection(data.patient.username);
    router.push("/patient/doctors");
  } else if (data.Type === "Doctor") {
    if (data.doctor.status === "Pending" || data.doctor.status === "Pending") {
      return { error: "Your request is still pending" };
    } else if (data.doctor.status === "Contract" || data.doctor.status === "Contract") {
      Cookies.set("doctor", data.doctor.username);
      router.push("/doctor/contract");
    } else {
      Cookies.set("username", data.doctor.username);
      Cookies.set("type", "doctor");
      setupSocketConnection(data.doctor.username);
      router.push("/doctor/patients");
    }
  } else if (data.Type === "Admin") {
    Cookies.set("username", data.admin.username);
    Cookies.set("type", "admin");
    router.push("/admin/admins");
  }

  return { success: true };
};

const loginAPI = async (credentials) => {
  try {
    const response = await axios(`${BACKEND_ROUTE}/login`, {
      method: "POST",
      data: credentials,
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: "Login failed. Please try again.",
    };
  }
};

const Page = () => {
  const router = useRouter();

  const usernameLoginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
      submit: null,
    },
    validationSchema: usernameLoginSchema,
    onSubmit: async (values, helpers) => {
      const result = await loginAPI({
        username: values.username,
        password: values.password,
      });

      if (result.success) {
        const loginResult = handleUserLogin(result.data, router);
        if (loginResult.error) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: loginResult.error });
          helpers.setSubmitting(false);
        }
      } else {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: result.error });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
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
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? Register as &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/doctorRegister"
                  underline="hover"
                  variant="subtitle2"
                >
                  Doctor
                </Link>
                , &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/patientRegister"
                  underline="hover"
                  variant="subtitle2"
                >
                  Patient
                </Link>
              </Typography>
            </Stack>

            <form noValidate onSubmit={usernameLoginForm.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={
                    !!(usernameLoginForm.touched.username && usernameLoginForm.errors.username)
                  }
                  fullWidth
                  helperText={
                    usernameLoginForm.touched.username && usernameLoginForm.errors.username
                  }
                  label="Username"
                  name="username"
                  onBlur={usernameLoginForm.handleBlur}
                  onChange={usernameLoginForm.handleChange}
                  value={usernameLoginForm.values.username}
                />
                <TextField
                  error={
                    !!(usernameLoginForm.touched.password && usernameLoginForm.errors.password)
                  }
                  fullWidth
                  helperText={
                    usernameLoginForm.touched.password && usernameLoginForm.errors.password
                  }
                  label="Password"
                  name="password"
                  onBlur={usernameLoginForm.handleBlur}
                  onChange={usernameLoginForm.handleChange}
                  type="password"
                  value={usernameLoginForm.values.password}
                />
              </Stack>
              {usernameLoginForm.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {usernameLoginForm.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={() => router.push("/auth/forgotPassword")}
              >
                Forgot Password?
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
