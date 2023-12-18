import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpTrayIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';

import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  SvgIcon,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Collapse,
  TextField,
  MenuItem,
  Menu
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';


export const Row = (props) => {
  const { row: patient } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const anchorRef = useRef(null);
  const [appointmentMenu, setAppointmentMenu] = useState({});

  const handleButtonClick = (event, appointment) => {
    setAppointmentMenu({
      ...appointmentMenu,
      [appointment._id]: {
        anchorEl: event.currentTarget,
        selectedItem: appointmentMenu[appointment._id]?.selectedItem || '',
      },
    });
    console.log("button clicked");
  };

  const handleMenuClose = (appointmentID) => {
    setAppointmentMenu({
      ...appointmentMenu,
      [appointmentID]: {
        anchorEl: null,
        selectedItem: appointmentMenu[appointmentID]?.selectedItem || '',
      },
    });
  };

  const handleMenuItemClick = (item, appointment) => {
    setAppointmentMenu({
      ...appointmentMenu,
      [appointment._id]: {
        anchorEl: null,
        selectedItem: item,
      },
    });
    if (item === "View Appointments") {
      router.push(`/doctor/viewAppointments?username=${patient.Username}`)
    }
    else if (item === "View Prescriptions") {
      router.push(`/doctor/prescriptions?username=${patient.Username}`)
    }
    else if (item === "View Health Records") {
      router.push(`/doctor/medical-history?username=${patient.Username}`)
    }
    else if (item === "Schedule a Follow-Up") {

    }
  };

  const buttons = ["View Appointments", "View Prescriptions", "View Health Records", "Schedule a Follow-Up"];
  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Typography>
            {patient.FirstName} {patient.LastName}
          </Typography>
        </TableCell>
        <TableCell>
          {patient.Email}
        </TableCell>
        <TableCell>
          {patient.DateOfBirth}
        </TableCell>
        <TableCell align='right'>
          <div>
            <Tooltip title="Menu">
              <IconButton
                onClick={(event) => handleButtonClick(event, patient)}
                children={(
                  <SvgIcon fontSize="small">
                    <EllipsisVerticalIcon />
                  </SvgIcon>
                )}
                color="primary"
              >
              </IconButton >
            </Tooltip>
            <Menu
              anchorEl={appointmentMenu[patient._id]?.anchorEl}
              open={Boolean(appointmentMenu[patient._id]?.anchorEl)}
              onClose={() => {
                handleMenuClose(patient._id);

              }}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {buttons.map((item, index) => (
                <MenuItem key={index} onClick={() => {
                  handleMenuItemClick(item, patient)
                }}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};