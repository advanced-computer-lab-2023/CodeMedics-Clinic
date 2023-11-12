import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const PatientPopup = (props) => {
  const {
    width = '25%',
    height = '15vh',
    items = {},
    isOpenEmergencyContact = false, // Set a default value here
    setIsOpenEmergencyContact
  } = props;
  console.log(items);
  return (
    <Popup
      open={isOpenEmergencyContact}
      closeOnDocumentClick
      onClose={() => setIsOpenEmergencyContact(false)}
      overlayStyle={{ // Apply styles to the overlay
        backgroundColor: 'transparent', // Semi-transparent white background
        backdropFilter: isOpenEmergencyContact ? 'blur(2px)' : 'none', // Apply a blur filter to the background when Popup is open
        transition: 'backdrop-filter 0.3s ease-out' // Add a smooth transition
      }}
      contentStyle={{ // Apply custom styles to the Popup content
        background: '#F5F7FF',
        width: width, // Set the width to 50% of the screen width
        height: height,
        padding: '20px',
        borderRadius: '10px',
        border: '5px solid #ccc'
      }}
    >
      <Card><Scrollbar><Box
        sx={{ minWidth: 200 }}><Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Mobile Number
            </TableCell>
            <TableCell>
              Relationship
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={items.fullName}>
            <TableCell>
              {items.fullName}
            </TableCell>
            <TableCell>
              {items.mobileNumber}
            </TableCell>
            <TableCell>
              {items.relation}
            </TableCell>
          </TableRow>


        </TableBody>
      </Table></Box></Scrollbar></Card>
    </Popup>
  );
};

PatientPopup.propTypes = {
  items: PropTypes.object,
  width: PropTypes.string,
  height: PropTypes.string
};
