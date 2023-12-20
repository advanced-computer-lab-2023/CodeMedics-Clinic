import Head from 'next/head';
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
  Button,
  SvgIcon,
  Alert
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/admin/layout';
import { OverviewPackages } from 'src/sections/overview/admin/overview-packages';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Message from 'src/components/Message';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';

const now = new Date();

const Page = () => {

  const [packages, setPackages] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState('');
  useEffect(() => {
    if (showErrorAlert) {
      // Set a timeout to hide the alert after 5 seconds
      const timeoutId = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3500);

      // Clear the timeout when the component unmounts or when showErrorAlert changes
      return () => clearTimeout(timeoutId);
    }
  }, [showErrorAlert]);

  useEffect(() => {
    axios.get('http://localhost:8000/patient/getAvailablePackages', { withCredentials: true })
         .then((response) => {
           setPackages(response.data);
         })
         .catch((error) => {
           setShowError(true);
           setErrorMessage(error.response.data.message);
         });
  }, []);
  const handleAddButtonClick = () => {
    setIsAddOpen(true);
  };
  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message condition={showError} setCondition={setShowError} title={'Error'}
               message={errorMessage} buttonAction={'Close'}/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >

        <Container maxWidth="xl">
          <Typography variant="h3" gutterBottom>
            Packages
          </Typography>
          <Button
            color="inherit"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowUpOnSquareIcon/>
              </SvgIcon>
            )}
            onClick={handleAddButtonClick}
          >
            Add Package
          </Button>
          {showErrorAlert && (
            <Alert severity="success">{showErrorAlert}</Alert>
          )}
          <Grid container spacing={3}>
            <Grid xs={20} md={20} lg={15}>
              <OverviewPackages initialPackages={packages} isAddOpen={isAddOpen}
                                setIsAddOpen={setIsAddOpen} setShowErrorAlert={setShowErrorAlert}
                                sx={{ height: '100%' }}/>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
