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


console.log("TEST COOKIES", Cookies.get("token"));
// const getPatients = async () => {
//   await axios.get(`http://localhost:8000/doctor/viewPatients`, {
//     withCredentials: true
//   })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   })
// };

// //const data = await getPatients();
// console.log("HERE IN DOCTOR PATIENTS")
// console.log(data);

const Page = ({ patients }) => {
  const [data, setData] = useState(patients);
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
              products={data}
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

export async function getServerSideProps() {
  try {
    // Fetch data from the provided API
    const response = await axios('http://localhost:8000/doctor/viewPatients', {
      method: "GET",
      withCredentials: true
    });
    const patients = response.data;
    console.log(patients);
    return {
      props: patients,
    };
  } catch (error) {
    console.error('Error fetching patients:', error);
    return {
      props: { patients: [] }, // Return an empty array in case of an error
    };
  }
}


export default Page;
