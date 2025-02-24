import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Badge,
  useTheme,
} from "@mui/material";
import {
  MoreVert,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  People,
  ContentCopy,
} from "@mui/icons-material";
import BottomMessage from "../Miscellaneous/BottomMessage";
import Video from "./Video";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function Meet({ participants, toggleVideo, toggleAudio, hasPendingRequests }) {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const router = useRouter();

  const columns = Math.ceil(Math.sqrt(participants.length));
  const rows = Math.ceil(participants.length / columns);

  const copyMeetingLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setMessage("Meeting link copied!");
    setTimeout(() => setMessage(""), 2000);
  };

  const elements = participants.map(({ name, ref }, index) => {
    return (
      <Box
        key={index}
        sx={{
          position: "relative",
          backgroundColor: "black",
          borderRadius: 2,
          aspectRatio: "16/9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {index === 0 ? (
          <video
            ref={ref}
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Video peer={ref} />
        )}
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 1,
            fontSize: "1.2rem"
          }}
        >
          {name}
        </Typography>
      </Box>
    );
  });

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="default" sx={{ boxShadow: "none", mb: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CodeMedics Meet
          </Typography>
          <IconButton onClick={copyMeetingLink} color="primary" title="Copy meeting link">
            <ContentCopy />
          </IconButton>
          <IconButton title="More options">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: participants.length === 1 ? "1fr" : `repeat(${columns}, 1fr)`,
          gridTemplateRows: participants.length === 1 ? "1fr" : `repeat(${rows}, 1fr)`,
          gap: 1,
          p: 1,
          alignItems: "center",
          justifyContent: participants.length === 1 ? "center" : "stretch",
        }}
      >
        {elements}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 0.5,
          backgroundColor: theme.palette.background.default,
          flexShrink: 0,
        }}
      >
        <IconButton
          color="primary"
          title={`${micOn ? "Mute" : "unMute"} microphone`}
          onClick={() => {
            setMicOn(!micOn);
            toggleAudio();
          }}
        >
          {micOn ? <Mic /> : <MicOff />}
        </IconButton>
        <IconButton
          color="primary"
          title={`Turn camera ${cameraOn ? "off" : "on"}`}
          onClick={() => {
            setCameraOn(!cameraOn);
            toggleVideo();
          }}
        >
          {cameraOn ? <Videocam /> : <VideocamOff />}
        </IconButton>
        <IconButton color="primary" title="Participants">
          {hasPendingRequests ? (
            <Badge color="error" variant="dot">
              <People />
            </Badge>
          ) : (
            <People />
          )}
        </IconButton>
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={() => {
            router.push(`${Cookies.get("isDoctor") ? "/doctor/patients" : "/patient/doctors"}`);
          }}
        >
          Leave
        </Button>
      </Box>
      <BottomMessage
        condition={Boolean(message)}
        severity={"success"}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
}
export default Meet;
