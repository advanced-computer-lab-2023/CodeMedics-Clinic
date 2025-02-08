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
import axios from "axios";
import { useState, useEffect } from "react";
import Message from "src/components/Miscellaneous/Message";
import CardObject from "src/components/CardObject/CardObject";
import Form from "src/components/Form";
import LoadingSpinner from "src/components/LoadingSpinner";

const Page = () => {
  const params = new URLSearchParams(window.location.search);
  const doctorUsername = params.get("doctorUsername");
  const counter = params.get("counter");
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/patient/getDoctorByUsername?username=${doctorUsername}`)
      .then((res) => {
        console.log("data", res.data.doctor);
        setDoctor(res.data.doctor);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  const values = {
    FirstName: doctor.FirstName,
    LastName: doctor.LastName,
    Email: doctor.Email,
    HourlyRate: doctor.HourlyRate,
    Speciality: doctor.Speciality,
  };

  console.log("first values", values);

  const fields = [
    {
      name: "FirstName",
      label: "FirstName",
      type: "text",
      disabled: true,
    },
    {
      name: "LastName",
      label: "LastName",
      type: "text",
      disabled: true,
    },
    {
      name: "Email",
      label: "Email Address",
      type: "email",
      disabled: true,
    },
    {
      name: "HourlyRate",
      label: "Hourly Rate",
      type: "text",
      disabled: true,
    },
    {
      name: "Speciality",
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
        <title>{doctor.FirstName}</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={errorMessage}
        buttonAction={"Close"}
      />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Dr. {doctor.FirstName}'s Profile</Typography>
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
                          `${doctor.FirstName} ${doctor.LastName}`,
                          `${doctor.affiliation} / ${doctor.Degree}`,
                        ]}
                      />
                    </Grid>
                    <Grid xs={12} md={6} lg={8} sx={{ width: "100%" }}>
                      <Form
                        title={`${doctor.Username}'s Profile`}
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
