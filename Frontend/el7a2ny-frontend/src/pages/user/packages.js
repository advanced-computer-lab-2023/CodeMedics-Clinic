import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewPackages } from 'src/sections/overview/overview-packages';
import axios from 'axios';
import { useState , useEffect } from 'react';

const now = new Date();

const Page = () => {

  const [packages, setPackages] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/patient/getAvailablePackages' , {withCredentials: true})
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      setPackages(data);
    })
    .catch((error) => {
      console.log(error);
    });
  },[]);

  useEffect(() => {
    axios.get('http://localhost:8000/patient/getMe' , {withCredentials: true})
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      console.log(data);
      setMe(data);
    })
    .catch((error) => {
      console.log(error);
    });
  },[]);

  return (
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
        <Typography variant="h3" gutterBottom>
          Packages
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={20} md={20} lg={15}>
            <OverviewPackages packages={packages} me={me} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
