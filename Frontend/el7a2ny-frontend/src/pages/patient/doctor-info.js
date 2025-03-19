import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  CardContent,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import Message from "src/components/Miscellaneous/Message";
import CardObject from "src/components/CardObject/CardObject";
import Form from "src/components/Form";
import LoadingSpinner from "src/components/LoadingSpinner";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";

const Page = () => {
  const params = new URLSearchParams(window.location.search);
  const doctorUsername = params.get("doctorUsername");
  const counter = params.get("counter");
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState({});
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  useGet({
    url: `${BACKEND_ROUTE}/patients/doctors/${doctorUsername}`,
    setData: setDoctor,
    setError,
    setLoading,
    setShowError,
  });

  const values = {
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: doctor.email,
    hourlyRate: doctor.hourlyRate,
    speciality: doctor.speciality,
  };

  console.log("first values", values);

  const fields = [
    {
      name: "firstName",
      label: "FirstName",
      type: "text",
      disabled: true,
    },
    {
      name: "lastName",
      label: "LastName",
      type: "text",
      disabled: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      disabled: true,
    },
    {
      name: "hourlyRate",
      label: "Hourly Rate",
      type: "text",
      disabled: true,
    },
    {
      name: "speciality",
      label: "Speciality",
      type: "text",
      disabled: true,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <title>{doctor.firstName}</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Dr. {doctor.firstName}'s Profile</Typography>
            </div>
            <div>
              <Grid containerspacing={3}>
                <CardContent>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))"
                    gap={2}
                  >
                    <Grid xs={12} md={6} lg={4}>
                      <CardObject
                        item={doctor}
                        index={counter}
                        texts={[
                          `${doctor.firstName} ${doctor.lastName}`,
                          `${doctor.affiliation} / ${doctor.degree}`,
                        ]}
                      />
                    </Grid>
                    <Grid xs={12} md={6} lg={8} sx={{ width: "100%" }}>
                      <Form
                        title={`${doctor.username}'s Profile`}
                        fields={fields}
                        values={values}
                      />
                    </Grid>
                  </Box>
                </CardContent>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
