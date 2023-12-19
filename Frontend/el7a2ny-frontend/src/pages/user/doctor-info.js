import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { OverviewDoctorInfoProfile } from 'src/sections/overview/overview-doctor-info-profile';
import { OverviewDoctorInfoDetails } from 'src/sections/overview/overview-doctor-info-details';
import Message from 'src/components/Message';

const Page = () => {
    
    const params = new URLSearchParams(window.location.search);
    const doctorUsername = params.get('doctorUsername');
    const counter = params.get('counter');

    const [doctor, setDoctor] = useState({});
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios
          .get(`http://localhost:8000/patient/getDoctorByUsername?username=${doctorUsername}`)
          .then((res) => {
            console.log(res.data.doctor);
            setDoctor(res.data.doctor);
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
        {doctor.FirstName}
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
              Dr. {doctor.FirstName}'s Profile
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
                <OverviewDoctorInfoProfile doctor={doctor} counter={counter} />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <OverviewDoctorInfoDetails doctor={doctor} />
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
