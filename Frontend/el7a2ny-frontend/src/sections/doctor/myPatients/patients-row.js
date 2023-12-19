import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpTrayIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import Message from 'src/components/Message';

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
import Cookies from 'js-cookie';
import { set } from 'lodash';

import axios from 'axios';

import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

export const Row = (props) => {
  const { row: patient } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const anchorRef = useRef(null);
  const [appointmentMenu, setAppointmentMenu] = useState({});
  const username = Cookies.get('username');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const getUnreservedAppointments = async () => {
    setLoading(true);
    await axios.get('http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername='+username).then((res) => {
      setUnreservedAppointments(res.data.appointments);
      setLoading(false);
      console.log("in the getUnreserved");
    }).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.error);
    });
  };
  const [scheduling, setScheduling] = useState(false);
  const [toBeUpdated, setToBeUpdated] = useState();
  const handleMenuItemClick = (item, patient) => {
    setAppointmentMenu({
      ...appointmentMenu,
      [patient._id]: {
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
      setScheduling(true);
      setToBeUpdated(patient);
      getUnreservedAppointments();
    }
  };

  const acceptRequest = async (appointmentID, patient) => {
    await axios.patch('http://localhost:8000/patient/bookAppointment?appointmentId='+appointmentID+'&patientUsername='+patient.Username+'&isRequested=true').then((res) => {
      console.log("appointment booked");
      setScheduling(false);
      window.location.reload();
    }).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.error);
    });
  }
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const buttons = ["View Appointments", "View Prescriptions", "View Health Records", "Schedule a Follow-Up"];
  return (
    <Fragment>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Typography>
            {patient.patient.FirstName} {patient.patient.LastName}
          </Typography>
        </TableCell>
        <TableCell>
          {patient.patient.Email}
        </TableCell>
        <TableCell>
          {patient.patient.DateOfBirth}
        </TableCell>
        <TableCell align='right'>
          <div>
            <Tooltip title="Menu">
              <IconButton
                onClick={(event) => handleButtonClick(event, patient.patient)}
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
              anchorEl={appointmentMenu[patient.patient._id]?.anchorEl}
              open={Boolean(appointmentMenu[patient.patient._id]?.anchorEl)}
              onClose={() => {
                handleMenuClose(patient.patient._id);
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ horizontal: 'center' }}
            >
              {buttons.map((item, index) => (
                <MenuItem key={index} onClick={() => {
                  handleMenuItemClick(item, patient.patient)
                }}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </TableCell>
      </TableRow>
      {scheduling && (
        <>
          <Dialog open={scheduling} onClose={() => setScheduling(false)}>
                <DialogTitle>Choose a Slot</DialogTitle>
                <DialogContent>
                {loading && (<div>
                    <DialogContentText>Loading...</DialogContentText>
                  </div>)}
                {!loading && unreservedAppointments.length === 0 && (<div>
                    <DialogContentText>No Available Slots</DialogContentText>
                  </div>)}
                {!loading && unreservedAppointments.length > 0 && (
                  <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Day
                </TableCell>
                <TableCell>
                  From
                </TableCell>
                <TableCell>
                  To
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unreservedAppointments.map((appointment) => {
                
                // const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={appointment._id}
                  >
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {days[new Date(appointment.date).getDay()]}
                    </TableCell>
                    <TableCell>
                      {appointment.startHour}
                    </TableCell>
                    <TableCell>
                      {appointment.endHour}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => {acceptRequest(appointment._id, toBeUpdated)}}>Pick Slot</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
                )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScheduling(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
      )}
    </Fragment>
    
  );
};