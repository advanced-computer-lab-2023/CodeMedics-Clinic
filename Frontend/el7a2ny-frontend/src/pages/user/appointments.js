import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewAppointments } from 'src/sections/overview/overview-appointments';
import axios from 'axios';

const now = new Date();

const Page = () => {
    
    const params = new URLSearchParams(window.location.search);
    const doctorUsername = params.get('doctorUsername');
    
    return(
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
            <OverviewAppointments sx={{ height: '100%' }} username={doctorUsername} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
