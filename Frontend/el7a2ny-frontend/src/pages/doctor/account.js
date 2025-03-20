import { useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import Message from "src/components/Miscellaneous/Message";
import Title from "src/components/Table/Body/Title";
import LoadingSpinner from "src/components/LoadingSpinner";
import Account from "src/components/Account/Account";
import { BACKEND_ROUTE } from "src/utils/Constants";
import { useGet } from "src/hooks/custom-hooks";
import Cookies from "js-cookie";

const Page = () => {
  const [doctor, setDoctor] = useState({});
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
      name: "affiliation",
      label: "Affiliation",
      type: "text",
    },
    {
      name: "hourlyRate",
      label: "Hourly Rate",
      type: "number",
    },
    {
      name: "dateOfBirth",
      label: "Date Of Birth",
      type: "text",
    },
    {
      name: "degree",
      label: "Educational Degree",
      type: "text",
    },
    {
      name: "speciality",
      label: "Speciality",
      type: "text",
    },
  ];

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${Cookies.get("username")}`,
    setData: setDoctor,
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
            <div>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Account
                  user={doctor}
                  fields={fields}
                  setError={setError}
                  setShowError={setShowError}
                />
              )}
            </div>
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
