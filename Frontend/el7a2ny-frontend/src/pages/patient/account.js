import { useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import Message from "src/components/Miscellaneous/Message";
import Title from "src/components/Table/Body/Title";
import LoadingSpinner from "src/components/LoadingSpinner";
import Account from "src/components/Account/Account";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";
import Cookies from "js-cookie";

const Page = () => {
  const [patient, setPatient] = useState({});
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "number",
      label: "Phone Number",
      type: "text",
    },
    {
      name: "dateOfBirth",
      label: "Date Of Birth",
      type: "date",
    },
    {
      name: "emergencyContact.name",
      label: "Emergency Contact Name",
      type: "text",
    },
    {
      name: "emergencyContact.number",
      label: "Emergency Contact Number",
      type: "text",
    },
    {
      name: "emergencyContact.relation",
      label: "Emergency Contact Relation",
      type: "text",
    },
  ];

  useGet({
    url: `${BACKEND_ROUTE}/patients/${Cookies.get("username")}`,
    setData: setPatient,
    setLoading,
    setError,
    setShowError,
  });

  return (
    <>
      <Title title="My Account" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Account</Typography>
            </div>
            <div>{loading ? <LoadingSpinner /> : <Account user={patient} fields={fields} />}</div>
          </Stack>
        </Container>
      </Box>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
