import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-patients';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const now = new Date();


const Page = () => {

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:8000/doctor/viewPatients',
      withCredentials: true,
    })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("ABOUT TO PRINT PATIENTS");
  console.log(patients);

  
return (
  <>
    <Head>
      <title>
        Patients
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >

          
            <OverviewLatestProducts 
              products={patients}
              sx={{ height: '100%' }}
            />
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            
          </Grid>
        </Grid>
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
