import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import Cookies from "js-cookie";
import { PATCH } from "src/project-utils/helper-functions";
import { BACKEND_ROUTE } from "src/utils/Constants";

export const SettingsPassword = () => {
  const username = Cookies.get("username");

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .max(35, "Password must be at most 35 characters")
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        // password must have at least one digit and at least one capital letter
        .matches(
          /^(?=.*\d)(?=.*[A-Z]).+$/,
          "Password must have at least one Capital Character and one Digit"
        ),
      confirmPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(35, "Password must be at most 35 characters")
        .required("Confirmation Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values, helpers) => {
      if (values.password !== values.confirmPassword) {
        throw new Error("passwords don't match but they have passed the check");
      } else {
        PATCH({
          url: `${BACKEND_ROUTE}/${Cookies.get("type")}s/${username}`,
          body: { password: values.password },
          setShowError,
          setError,
          updater: () => {
            window.location.reload();
          },
        });
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
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
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
