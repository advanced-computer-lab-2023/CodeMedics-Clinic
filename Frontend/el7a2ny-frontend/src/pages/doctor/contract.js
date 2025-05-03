import Cookies from "js-cookie";
import React from "react";
import axios from "axios";
import FileSaver from "file-saver";
import { useAuth } from "src/hooks/use-auth";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import Message from "src/components/Miscellaneous/Message";
import { BACKEND_ROUTE } from "src/utils/Constants";
import { PATCH } from "src/utils/helper-functions";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const body = {
    username: Cookies.get("doctor"),
    action: "agree",
  };
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const username = Cookies.get("doctor");

  const handleAcceptContract = () => {
    PATCH({
      url: `${BACKEND_ROUTE}/admins/doctors/${username}/applications`,
      body: { status: "approved" },
      updater: () => {
        Cookies.set("username", Cookies.get("doctor"));
        Cookies.set("type", "doctor");
        router.push("/doctor/patients");
      },
      setShowError,
      setError,
    });
  };

  const handleRejectContract = async () => {
    PATCH({
      url: `${BACKEND_ROUTE}/admins/doctors/${username}/reject`,
      updater: () => {
        auth.signOut();
        router.push("/auth/login");
      },
      setShowError,
      setError,
    });
  };

  const handleDownloadContract = async () => {
    try {
      const doctorUsername = Cookies.get("doctor");
      const response = await axios.post(
        `${BACKEND_ROUTE}/admins/doctors/${doctorUsername}/download-contract`,
        { doctor: doctorUsername },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Contract.pdf`;
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setShowError(true);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <Head>
        <title>Emplyment Contract</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <Box sx={{ ml: 4 }}>
            <Typography variant="h4" gutterBottom>
              Contract Agreement
            </Typography>
            <Typography variant="body1" gutterBottom></Typography>
          </Box>
          <Button
            onClick={handleDownloadContract}
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "400px", height: "50px", fontSize: "1.2rem" }}
          >
            Download Contract
          </Button>
          <Box
            textAlign="center"
            mt={2}
            sx={{ width: "400px", display: "flex", justifyContent: "space-between" }}
          >
            <Button
              onClick={handleAcceptContract}
              variant="contained"
              color="success"
              sx={{ width: "calc(50% - 5px)", fontSize: "1.1rem" }}
            >
              Accept
            </Button>
            <Button
              onClick={handleRejectContract}
              variant="contained"
              color="error"
              sx={{ width: "calc(50% - 5px)", fontSize: "1.1rem" }}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
