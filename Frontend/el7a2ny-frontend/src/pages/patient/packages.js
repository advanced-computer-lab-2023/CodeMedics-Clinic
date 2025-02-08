import Head from "next/head";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { OverviewPackages } from "src/sections/overview/overview-packages";
import axios from "axios";
import { useState, useEffect } from "react";
import Message from "src/components/Miscellaneous/Message";
import LoadingSpinner from "src/components/LoadingSpinner";
const now = new Date();

const Page = () => {
  const [packages, setPackages] = useState([]);
  const [me, setMe] = useState({});
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/patient/getAvailablePackages", { withCredentials: true })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setPackages(data);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/patient/getMe", { withCredentials: true })
      .then((response) => {
        console.log("response", response);
        setMe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  console.log("patient", me);

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={errorMessage}
        buttonAction={"Close"}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 3,
              px: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Current Health Package
            </Typography>
            <CardContent sx={{ pt: 3 }}>
              <Stack spacing={3}>
                <Stack xs={12} md={4} direction="row" spacing={3}>
                  <TextField
                    fullWidth
                    label="Health Package Name"
                    disabled
                    name="HealthPackageName"
                    value={me.HealthPackage.membership}
                    sx={{
                      width: "30%"
                    }}
                  />
                  <TextField
                    label="Health Package Expiration Date"
                    disabled
                    name="HealthPackageExpirationDate"
                    sx={{
                      width: "30%"
                    }}
                    value={
                      me.HealthPackage.date == null
                        ? "No Expiration"
                        : new Date(me.HealthPackage.date).toDateString()
                    }
                  />
                </Stack>
                <Stack xs={6} md={4} direction="row" spacing={3}>
                  <TextField
                    label="Health Package Status"
                    disabled
                    name="HealthPackagePrice"
                    sx={{
                      width: "30%"
                    }}
                    value={
                      me.HealthPackage.status == "EndDateCancelled"
                        ? "Cancelled with end date"
                        : me.HealthPackage.status == "Inactive"
                        ? "Free Package Active"
                        : "Active"
                    }
                  />
                  <TextField
                    label="Health Package Type"
                    disabled
                    name="EmergencyContactName"
                    sx={{
                      width: "30%"
                    }}
                    value={me.HealthPackage.status == "main" ? "Main" : "Family"}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Box>
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
                  <OverviewPackages packages={packages} me={me} sx={{ height: "100%" }} />
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
