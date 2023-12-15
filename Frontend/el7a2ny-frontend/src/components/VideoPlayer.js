import React, { use, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { SocketContext } from './VideoCallContext';

const VideoPlayer = (props) => {
  const {username} = props;
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <Grid container>
      {stream && (
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{'Calling ' + username + '...'}</Typography>
            <video playsInline muted ref={myVideo} autoPlay />
          </Grid>
      )}
      {callAccepted && !callEnded && (
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            <video playsInline ref={userVideo} autoPlay onError={(e) => console.log("Error with userVideo:", e)} />
          </Grid>
      )}
    </Grid>
  );
};

export default VideoPlayer;
