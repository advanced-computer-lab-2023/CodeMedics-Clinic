import Head from "next/head";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
  CardContent,
  TextField,
  Stack,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { OverviewPackages } from "src/sections/overview/overview-packages";
import { useState } from "react";
import Message from "src/components/Miscellaneous/Message";
import LoadingSpinner from "src/components/LoadingSpinner";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Cookies from "js-cookie";
import { useGet } from "src/hooks/custom-hooks";
import Title from "src/components/Table/Body/Title";
import Form from "src/components/Form";

const Page = () => {
  const [packages, setPackages] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  const values = patient ? {
    healthPackageName: patient.healthPackage.name,
    healthPackageExpirationDate:
      patient.healthPackage.date == null
        ? "No Expiration"
        : new Date(patient.healthPackage.date).toDateString(),
    healthPackageStatus:
      patient.healthPackage.status == "EndDateCancelled"
        ? "Cancelled with end date"
        : patient.healthPackage.status == "Inactive"
        ? "Free Package Active"
        : "Active",
    healthPackageType: patient.healthPackage.status == "main" ? "Main" : "Family",
  } : null;

  const fields = [
    {
      name: "healthPackageName",
      label: "Health Package Name",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageExpirationDate",
      label: "Health Package Expiration Date",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageStatus",
      label: "Health Package Status",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageType",
      label: "Health Package Type",
      type: "text",
      disabled: true,
    },
  ];

  useGet({
    url: `${BACKEND_ROUTE}/patients/packages`,
    setData: setPackages,
    setShowError,
    setError,
  });

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}`,
    setData: setPatient,
    setShowError,
    setError,
    setLoading,
  });

  return (
    <>
      <Title title="El7a2ny Clinic" />
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Form title="Current Health Package" values={values} fields={fields} largeTitle="true"/>
          <Box
            component="data"
            sx={{
              flexGrow: 1,
              py: 2,
            }}
          >
            <Container maxWidth="xl">
              <Typography variant="h4" gutterBottom>
                Packages
              </Typography>
              <Grid container spacing={3}>
                <Grid xs={20} md={20} lg={15}>
                  <OverviewPackages packages={packages} patient={patient} sx={{ height: "100%" }} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
