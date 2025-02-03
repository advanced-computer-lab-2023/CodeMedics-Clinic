import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const Message = ({ condition, setCondition, title, message, action }) => {
  return (
    <Dialog open={condition} onClose={() => setCondition(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCondition(false)}>{action}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Message;