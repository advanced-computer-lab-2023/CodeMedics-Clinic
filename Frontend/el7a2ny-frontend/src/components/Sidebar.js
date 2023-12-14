import React, { useState, useContext, useEffect } from 'react';

import { Button, TextField, Grid, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { SocketContext } from './VideoCallContext';

const Sidebar = (props) => {
  const {username} = props;
  console.log(username);
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);

  return me ? (
        <form noValidate autoComplete="off">
          <Grid container>
            <Grid item xs={12} md={6}>
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall}>
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" color="primary" disabled={!me} startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(username)}>
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
          {props.children}
        </form>
  ) : null;
};

export default Sidebar;
