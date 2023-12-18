import PropTypes from 'prop-types';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';

import { List, ListItemButton, ListItem, ListItemText} from '@mui/material';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Menu,
} from '@mui/material';
const statusMap = {
    upcoming: 'warning',
    cancelled: 'error',
    completed: 'success',
    rescheduled: 'warning'
};  

import Cookies from 'js-cookie';
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
  DialogContentText,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { set } from 'lodash';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
export const PatientAppointmentsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    curUsername, setCurUsername
  } = props;

  

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const router = useRouter();
  const [cancelAppointment, setCancelAppointment] = useState(items);
  const [invalidCancel, setInvalidCancel] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const [rescheduling, setRescheduling] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [invalidRequest, setInvalidRequest] = useState(false);
  const CancelAppointment = async (appointmentID) => {
    await axios.patch(`http://localhost:8000/patient/CancelAppointment?appointmentID=${appointmentID}`).then(res =>{
      console.log(res);
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    });
  };
  
  
  const getUnreservedAppointments = async (doctorUsername) => {
    setLoading(true);
    await axios.get('http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername='+doctorUsername).then((res) => {
      setUnreservedAppointments(res.data.appointments);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  };
    

  const [appointmentMenu, setAppointmentMenu] = useState({});
  const [toBeUpdated, settoBeUpdated] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if(item === "Cancel"){
      if(appointment.status !== 'upcoming'){
          setInvalidCancel(true);
          settoBeUpdated(appointment);
      }
      else{
        setCancelling(true);
        settoBeUpdated(appointment);
      }
    }
    else if(item === "Reschedule"){
      settoBeUpdated(appointment);
      setRescheduling(true);
      getUnreservedAppointments(appointment.doctorUsername);
    }
    else if(item === "Request a Follow-up"){
      if(appointment.status !== 'completed'){
        setInvalidRequest(true);
        settoBeUpdated(appointment);
      }
      else{
        setRequesting(true);
        settoBeUpdated(appointment);
      }
    }
  };

  const rescheduleAppointment = async (appointmentID, oldAppointment) => {
    await axios.patch(`http://localhost:8000/patient/RescheduleAppointment?appointmentID=${appointmentID}&oldAppointmentID=${oldAppointment}&username=${curUsername}`).then
    ((res) => {
      console.log(res);
      window.location.reload();
    }
    ).catch((err) => {
      console.log(err);
    });
  };

  const requestFollowUp = async (appointmentID) => {
    await axios.patch(`http://localhost:8000/patient/RequestFollowUp?appointmentID=${appointmentID}`).then
    ((res) => {
      console.log(res);
      window.location.reload();
    }
    ).catch((err) => {
      console.log(err);
    });
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const buttons = ["Cancel", "Request a Follow-up", "Reschedule"];
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Doctor
                </TableCell>
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
                  Status
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((appointment) => {
                const isSelected = selected.includes(appointment.id);
                // const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={appointment._id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {appointment.doctor}
                        </Typography>
                      </Stack>
                    </TableCell>
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
                    <SeverityPill color={statusMap[appointment.status]}>
                        {appointment.status}
                    </SeverityPill>
                    </TableCell>
                    <TableCell>
                    <div>
                        <Button onClick={(event) => handleButtonClick(event, appointment)}>
                          {appointmentMenu[appointment._id]?.selectedItem || 'Actions'}
                        </Button>
                        <Menu
                          anchorEl={appointmentMenu[appointment._id]?.anchorEl}
                          open={Boolean(appointmentMenu[appointment._id]?.anchorEl)}
                          onClose={() => {
                            handleMenuClose(appointment._id);
                            
                          }}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                          {buttons.map((item, index) => (
                            <MenuItem key={index} onClick={() => {handleMenuItemClick(item, appointment)
                            }}>
                              {item}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
          {rescheduling && toBeUpdated.status !== 'upcoming' && (<div>
            <Dialog open={rescheduling} onClose={() => {{
                  setRescheduling(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}}>
              <DialogTitle>Invalid Action</DialogTitle>
              <DialogContent>
              <DialogContentText sx={{ color: 'error.main' }}>
                  Appointment should be upcoming to be rescheduled
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setRescheduling(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  
                  }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)
          }
          {rescheduling && toBeUpdated.status === 'upcoming' && (<div>
            <Dialog open={rescheduling} onClose={() => {{
                  setRescheduling(false);
                  settoBeUpdated(null);
                  setUnreservedAppointments([]);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                }}}>
              <DialogTitle>Reschedule</DialogTitle>
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
                const isSelected = selected.includes(appointment.id);
                // const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={appointment._id}
                    selected={isSelected}
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
                      <Button onClick={() => {rescheduleAppointment(appointment._id, toBeUpdated._id)}}>Reschedule</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setRescheduling(false);
                  settoBeUpdated(null);
                  setUnreservedAppointments([]);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)}
          {invalidCancel && (<div>
            <Dialog open={invalidCancel} onClose={() => {{
                  setInvalidCancel(false);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}}>
              <DialogTitle>Invalid Action</DialogTitle>
              <DialogContent>
              <DialogContentText sx={{ color: 'error.main' }}>
                Appointment should be upcoming to be rescheduled
              </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setInvalidCancel(false);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)}
          {cancelling && toBeUpdated.status === 'upcoming' && (<div>
            
            <Dialog open={cancelling} onClose={() => {{
                  setCancelling(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}}>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogContent>
              <DialogContentText>
                  Are you sure you want to cancel this appointment?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setCancelling(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}>Close</Button>
                <Button onClick={() => {CancelAppointment(toBeUpdated._id)}}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>)}
          {invalidRequest && (<div>
            <Dialog open={invalidRequest} onClose={() => {{
                  setInvalidRequest(false);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}}>
              <DialogTitle>Invalid Action</DialogTitle>
              <DialogContent>
              <DialogContentText sx={{ color: 'error.main' }}>
                You can request a follow-up for only completed appointments
              </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setInvalidRequest(false);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)}
          {requesting && toBeUpdated.status === 'completed' && (<div>
            
            <Dialog open={requesting} onClose={() => {{
                  setRequesting(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}}>
              <DialogTitle>Request a Follow-up</DialogTitle>
              <DialogContent>
              <DialogContentText>
                  Are you sure you want to request a follow-up?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setRequesting(false);
                  settoBeUpdated(null);
                  setAppointmentMenu({
                    ...appointmentMenu,
                    [toBeUpdated._id]: {
                      anchorEl: null,
                      selectedItem: null,
                    },
                  });
                  }}>Cancel</Button>
                <Button onClick={() => {requestFollowUp(toBeUpdated._id)}}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>)}
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PatientAppointmentsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
