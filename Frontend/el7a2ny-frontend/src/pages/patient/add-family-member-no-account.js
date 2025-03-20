import Head from "next/head";
import { Box, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "src/components/Form";
import { BACKEND_ROUTE, familyMembersPageRoute } from "src/utils/Constants";
import { POST } from "src/project-utils/helper-functions";
import Cookies from "js-cookie";

const Genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const Page = () => {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [relationship, setRelationship] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      name: "name",
      label: "name",
      value: name,
      type: "text",
      setValue: setName,
    },
    {
      name: "relationship",
      label: "Relationship",
      value: relationship,
      type: "text",
      setValue: setRelationship,
    },
    {
      name: "nationalId",
      label: "National ID",
      type: "text",
      value: nationalId,
      setValue: setNationalId,
    },
    {
      name: "dateOfBirth",
      label: "Date Of Birth",
      type: "date",
      value: dateOfBirth,
      setValue: setDateOfBirth,
    },
    {
      name: "gender",
      label: "Gender",
      value: gender,
      type: "menu",
      setValue: setGender,
      options: Genders,
    },
  ];

  const username = Cookies.get("username");

  const router = useRouter();

  const onSubmit = async (values, helpers) => {
    try {
      const body = {
        name: values.name,
        nationalId: values.nationalId,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        relationship: values.relationship
      };
      console.log(body);
      POST({
        url: `${BACKEND_ROUTE}/patients/${username}/family-members-no-account`,
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
      router.push(familyMembersPageRoute);
    }
  };

  return (
    <>
      <Head>Add Family Member</Head>
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
              <Grid xs={12} md={16} lg={8}>
                <Form
                  title="Add Family Member"
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
