import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewFamilyMembers } from 'src/sections/overview/overview-doctors';
import { FamilyMembersSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState } from 'react';

const now = new Date();

const Page = ({ familyMembers }) => {
  
  const [data, setData] = useState(familyMembers);

  const handleSearch = (str) => {
    if(str === ""){
      setData(familyMembers);
    }else{
      setData(familyMembers.filter((familyMember) => {
        const fullName = familyMember.FirstName + " " + familyMember.LastName;
        return fullName.toLowerCase().includes(str.toLowerCase());
      }));
    }
  };

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
          Family Members
        </Typography>
        <FamilyMembersSearch handleSearch={handleSearch} />
        <Grid container spacing={3}>
          <Grid xs={20} md={20} lg={15}>
            <OverviewFamilyMembers familyMembers={data} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps() {
  try {
    // Fetch data from the provided API
    const response = await axios.get('http://localhost:8000/patient/familyMembers');
    const doctors = response.data;
    return {
      props:  {doctors} ,
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return {
      props: { doctors: [] }, // Return an empty array in case of an error
    };
  }
}

export default Page;
