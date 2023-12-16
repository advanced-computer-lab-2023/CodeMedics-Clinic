import React from 'react';
import Typography from '@mui/material/Typography';
import VideoPlayer from './VideoPlayer';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

const VideoCall = () => {

  const username = new URLSearchParams(window.location.search).get('username');

  return (
    <div>
      <Typography variant="h2" align="center">Video Chat</Typography>
      <VideoPlayer username={username}/>
      <Sidebar username={username}/>
    </div>
  );
};

export default VideoCall;
