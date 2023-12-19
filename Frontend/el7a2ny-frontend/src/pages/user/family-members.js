import Head from 'next/head';
import { Box, Container, Unstable_Grid2, Stack as Grid, Button, Typography, Stack } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewFamilyMembers } from 'src/sections/overview/overview-family-members';
import { PatientsSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
import Message from 'src/components/Message';

const now = new Date();

const Page = () => {

  const router = useRouter();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersNoAccount, setFamilyMembersNoAccount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = (str) => {
    if (str === "") {
      setData(familyMembers);
    } else {
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
    setLoading(true);
    axios('http://localhost:8000/patient/familyMembers', {
      method: 'GET',
      withCredentials: true
    }).then(response => {
      console.log(response);
      setFamilyMembers(response.data.familyMembers);
      setFamilyMembersNoAccount(response.data.familyMembersNoAccount);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
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
      <Message condition={showError} setCondition={setShowError} title="Error" message={errorMessage} buttonAction="Close" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row">
            <Typography variant="h3" gutterBottom>
              Family Members
            </Typography>
            <Button
              onClick={addFamilyMemberNoAccountRedirect} sx={{marginLeft: 'auto'}}>
              Add Family Member
            </Button>
            <Button
              onClick={addFamilyMemberRedirect} sx={{marginLeft: '0'}}>
              Add existing user as Family Member
            </Button>
          </Stack>
          {loading ? <LoadingSpinner /> : (
            familyMembers.length === 0 && familyMembersNoAccount.length === 0 ? (
              <NoRecords message={"No Family Members Found"} />
            ) : (
              <Grid container spacing={3}>
                <Grid xs={20} md={20} lg={15}>
                  <OverviewFamilyMembers familyMembers={familyMembers} familyMembersNoAccount={familyMembersNoAccount} sx={{ height: '100%' }} />
                </Grid>
              </Grid>
            )
          )}
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
