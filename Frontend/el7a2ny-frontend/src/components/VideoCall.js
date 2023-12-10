import React from 'react';
import Typography from '@mui/material/Typography';
import VideoPlayer from './VideoPlayer';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

const VideoCall = () => {

  return (
    <div>
      <Typography variant="h2" align="center">Video Chat</Typography>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default VideoCall;
