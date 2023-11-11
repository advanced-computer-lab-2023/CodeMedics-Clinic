import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { OverviewDoctorInfoProfile } from 'src/sections/overview/overview-doctor-info-profile';
import { OverviewDoctorInfoDetails } from 'src/sections/overview/overview-doctor-info-details';

const Page = () => {
    
    const params = new URLSearchParams(window.location.search);
    const doctorUsername = params.get('doctorUsername');
    const counter = params.get('counter');

    const [doctor, setDoctor] = useState({});

    useEffect(() => {
        axios
          .get(`http://localhost:8000/patient/getDoctorByUsername?username=${doctorUsername}`)
          .then((res) => {
            console.log(res.data.doctor);
            setDoctor(res.data.doctor);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    return(
  <>
    <Head>
      <title>
        Account | Devias Kit
      </title>
    </Head>
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
              Account
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
