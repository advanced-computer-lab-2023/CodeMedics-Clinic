import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewAppointments } from 'src/sections/overview/overview-appointments';
import axios from 'axios';

const now = new Date();

const Page = ({ appointments }) => (
  <>
    <Head>
      <title>El7a2ny Clinic</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={20} md={20} lg={15}>
            <OverviewAppointments appointments={appointments} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps() {
  try {
    // Fetch data from the provided API

    const params = new URLSearchParams(window.location.search);
    const doctorUsername = params.get('doctorUsername');

    const response = await axios.get(`http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername=${doctorUsername}`);
    const appointments = response.data;

    console.log(appointments);

    return {
      props:  {appointments} ,
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return {
      props: { appointments: [] }, // Return an empty array in case of an error
    };
  }
}

export default Page;
