import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Button, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewFamilyMembers } from 'src/sections/overview/overview-family-members';
import { DoctorsSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const now = new Date();

const Page = () => {

  const router = useRouter();
  
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersNoAccount, setFamilyMembersNoAccount] = useState([]);


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

  const addFamilyMember = () => {
    router.push(`/user/add-family-member`);
  }

  useEffect(() => {
    axios('http://localhost:8000/patient/familyMembers', {
      method: 'GET',  
      withCredentials: true
    }).then(response => {
      console.log(response);
      setFamilyMembers(response.data.familyMembers);
      setFamilyMembersNoAccount(response.data.familyMembersNoAccount);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  console.log("My family: ", familyMembers, familyMembersNoAccount);


  const addFamilyMemberRedirect = () => {
    router.push(`/user/add-family-member`);
  }

  const addFamilyMemberNoAccountRedirect = () => {
    router.push(`/user/add-family-member-no-account`);
  }

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
      <Button
        onClick={addFamilyMemberRedirect}>
        Add Family Member
      </Button>
      <Button 
        onClick={addFamilyMemberNoAccountRedirect}>
        Add Family Member Without Account
      </Button>
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom>
          Family Members
        </Typography>
        <DoctorsSearch handleSearch={handleSearch} />
        <Grid container spacing={3}>
          <Grid xs={20} md={20} lg={15}>
            <OverviewFamilyMembers familyMembers={familyMembers} familyMembersNoAccount={familyMembersNoAccount} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
