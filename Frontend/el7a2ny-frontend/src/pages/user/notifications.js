import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Message from 'src/components/Miscellaneous/Message';

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patient/getPatientMessages', { withCredentials: true });
      setNotifications(response.data.messages.reverse());
    } catch (error) {
      console.log(error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
  };
  useEffect(() => {
    // Fetch notifications initially
    fetchNotifications();

    // Set up interval to fetch notifications every 5 minutes (adjust as needed)
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);

    // Clean up interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" gutterBottom>
            Notifications
          </Typography>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Notification Message */}
                <Typography variant="body1" gutterBottom>
                  {notification.content}
                </Typography>

                {/* Date and Time */}
                <Typography variant="caption" color="textSecondary" sx={{ marginTop: '8px' }}>
                  {new Date(notification.timestamp).toLocaleDateString()}{' '}
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <Typography variant="body1">
                There are no notifications yet.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

