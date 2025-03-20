import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Form from "src/components/Form";
import { POST } from "src/utils/helper-functions";
import { BACKEND_ROUTE } from "src/utils/Constants";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      name: "email",
      label: "Email",
      value: email,
      type: "text",
      setValue: setEmail,
    },
    {
      name: "relationship",
      label: "Relationship",
      value: relationship,
      type: "text",
      setValue: setRelationship,
    },
  ];

  const username = Cookies.get("username");

  const onSubmit = async (values, helpers) => {
    try {
      const body = {
        email: values.email,
        relationship: values.relationship,
      };
      console.log(body);
      POST({
        url: `${BACKEND_ROUTE}/patients/${username}/family-members`,
        body,
        setShowError,
        setError,
        updater: () => {
          router.push("/patient/family-members");
        },
      });
    } catch (err) {
      console.log("in the error", err);
      helpers.setStatus({ success: false });
      helpers.setErrors({ Submit: err.response.data.message });
      helpers.setSubmitting(false);
      router.push("/patient/family-members");
    }
  };

  return (
    <>
      <Head>Add Existing User as a Family Member</Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid xs={12} md={8} lg={8}>
                <Form
                  title="Add existing user as a Family Member"
                  actionName="Add"
                  fields={fields}
                  onSubmit={onSubmit}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
