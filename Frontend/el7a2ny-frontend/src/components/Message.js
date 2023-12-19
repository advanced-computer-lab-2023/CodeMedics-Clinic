import { Dialog } from '@mui/material';
import React from 'react';

import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const Message = ({condition, setCondition, title, message, isError, buttonAction }) => {
    console.log(condition);
    console.log(title, message, buttonAction);
  return (
    (<div>
        <Dialog open={condition} onClose={() => {{
              setCondition(false);
              }}}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
                {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setCondition(false);
              }}>{buttonAction}</Button>
          </DialogActions>
        </Dialog>
      </div>)
  );
};

export default Message;