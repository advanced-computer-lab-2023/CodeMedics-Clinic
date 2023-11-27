import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const PopUp = ({ open, onClose, onAccept, onDecline }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Incoming Call</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to accept or decline the call?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color="secondary">
          Decline
        </Button>
        <Button onClick={onAccept} color="primary">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopUp;