import {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const Message = ({title, message, buttonAction }) => {
  const [condition, setCondition] = useState(true)
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