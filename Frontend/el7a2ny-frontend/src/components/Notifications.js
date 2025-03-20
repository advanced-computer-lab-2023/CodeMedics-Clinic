import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import Message from "src/components/Miscellaneous/Message";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/utils/Constants";
import Cookies from "js-cookie";
import LoadingSpinner from "src/components/LoadingSpinner";
import Header from "src/components/Table/Body/Header";
import NoRecords from "src/components/NoRecords";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  useGet({
    url: `${BACKEND_ROUTE}/${
      Cookies.get("type")
    }s/${username}/messages`,
    setData: setNotifications,
    setShowError,
    setError,
    setLoading,
  });

  if (loading) return <LoadingSpinner />;

  const notificationsELement = notifications.map((notification, index) => (
    <Box
      key={index}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1" gutterBottom>
        {notification.content}
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ marginTop: "8px" }}>
        {new Date(notification.timestamp).toLocaleDateString()}{" "}
        {new Date(notification.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  ));

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Header name="Notifications" />
          {notifications.length > 0 ? (
            notificationsELement
          ) : (
            <NoRecords message="No Notifications Found" />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Notifications;
