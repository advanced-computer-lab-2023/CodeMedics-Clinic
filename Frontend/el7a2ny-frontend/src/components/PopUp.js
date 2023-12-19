import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import VideoCall from 'src/components/VideoCall';
import { SocketContext } from './VideoCallContext';
import { useContext } from 'react';
import PropTypes from 'prop-types';

const PopUp = () => {
  const { callAccepted, name, setName, callEnded, leaveCall, callUser, call, answerCall, declineCall, myVideo } = useContext(SocketContext);

  const choose = () => {
    if(callAccepted){
      leaveCall();
    }else{
      declineCall();
    }
  }
  
  return (
    <Dialog open={call.isReceivingCall && !callEnded} onClose={choose}>
      <DialogTitle>Incoming Call From {call.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to accept or decline the call?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <VideoCall />
      </DialogActions>
      <DialogActions>
        {call.isReceivingCall && !callAccepted && <Button onClick={declineCall} color="secondary">
          Decline
        </Button>}
        {call.isReceivingCall && !callAccepted && <Button onClick={answerCall} color="primary">
          Accept
        </Button>}
      </DialogActions>
    </Dialog>
  );
};
PopUp.propTypes = {
  open: PropTypes.bool,
};

export default PopUp;