import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { OverviewPatientInfoProfile } from 'src/sections/overview/overview-patient-info-profile';
import { OverviewPatientInfoDetails } from 'src/sections/overview/overview-patient-info-details';
import Message from 'src/components/Message';

const Page = () => {
    
    const params = new URLSearchParams(window.location.search);
    const patientUsername = params.get('patientUsername');

    const [patient, setPatient] = useState({});
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios
          .get(`http://localhost:8000/doctor/getPatientByUsername?username=${patientUsername}`)
          .then((res) => {
            console.log("HERE IN PATIENT_INFO");
            console.log(res.data);
            setPatient(res.data);
          })
          .catch((err) => {
            console.log(err);
            setShowError(true);
            setErrorMessage(err.response.data.message);
          });
      }, []);

    return(
  <>
    <Head>
      <title>
        {patient.FirstName}
      </title>
    </Head>
    <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              {patient.FirstName}'s Profile
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <OverviewPatientInfoProfile patient={patient}/>
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <OverviewPatientInfoDetails patient={patient} />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
