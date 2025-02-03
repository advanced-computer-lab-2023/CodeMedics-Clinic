import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button, Menu, MenuItem, IconButton, Tooltip, SvgIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import axios from 'axios';
import { useState } from 'react';
import Message from 'src/components/Miscellaneous/Message';
export const CustomersTable = (props) => {
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
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [cancelAppointment, setCancelAppointment] = useState(items);

  const [invalidCancel, setInvalidCancel] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [invalidComplete, setInvalidComplete] = useState(false);
  const [added, setAdded] = useState(false);
  const CancelAppointment = async (appointmentID) => {
    await axios.patch(`http://localhost:8000/patient/CancelAppointment?appointmentID=${appointmentID}`).then(res => {
      console.log(res);
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    });
  };


  const CompleteAppointment = async (appointmentID) => {
    await axios.patch(`http://localhost:8000/patient/updateAppointmentStatus?oldAppointmentId=${appointmentID}` + `&status=${"completed"}`).then(res => {
      console.log(res);
      setAdded(true);
    }
    ).catch((err) => {
      console.log(err);
    });
  }

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

  const statusMap = {
    upcoming: 'warning',
    cancelled: 'error',
    completed: 'success',
    rescheduled: 'warning'
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
      if(appointment.status !== 'upcoming' && appointment.status !== 'rescheduled'){
          setInvalidCancel(true);
          settoBeUpdated(appointment);
          console.log("invalid cancel");
      }
      else {
        setCancelling(true);
        settoBeUpdated(appointment);
      }
    }
    else if (item === "Complete") {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(appointment.endHour);
      console.log(appointmentDate);
      console.log(new Date());
      console.log(appointmentDate < new Date());
      if(appointmentDate > new Date() || (appointment.status !== 'upcoming' && appointment.status !== 'rescheduled')){
        setInvalidComplete(true);
        settoBeUpdated(appointment);
        console.log("invalid complete");
      }
      else {
        setCompleting(true);
        settoBeUpdated(appointment);
      }
      console.log("in the complete");
    }
  };



  const buttons = [
    'Cancel', 'Complete'
  ]

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell>
                  Patient Name
                </TableCell>
                <TableCell>
                  Date
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((appointment) => {
                const isSelected = selected.includes(appointment.id);
                // const createdAt = format(appointment.createdAt, 'dd/MM/yyyy');




                return (
                  <TableRow
                    hover
                    key={appointment.id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {!appointment.patient ? '-----' : appointment.patient}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.date).toDateString()}
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
                        <Tooltip title="Menu">
                          <IconButton
                            onClick={(event) => handleButtonClick(event, appointment)}
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
                          anchorEl={appointmentMenu[appointment._id]?.anchorEl}
                          open={Boolean(appointmentMenu[appointment._id]?.anchorEl)}
                          onClose={() => {
                            handleMenuClose(appointment._id);

                          }}
                          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'center', horizontal: 'right' }}
                        >
                          {buttons.map((item, index) => (
                            <MenuItem key={index} onClick={() => {
                              handleMenuItemClick(item, appointment)
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
        {cancelling && (<div>
          <Dialog open={cancelling} onClose={() => {
            {
              setCancelling(false);
              settoBeUpdated(null);
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
                }}>Close</Button>
                <Button onClick={() => {
                  CancelAppointment(toBeUpdated._id);
                  setCancelling(false);
                  settoBeUpdated(null);
                }}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>)
          }
          {invalidCancel && (<div>
            <Message condition={invalidCancel} isError={true} setCondition={setInvalidCancel} title={"Invalid Action"} message = {"You can only cancel upcoming or rescheduled Appointments"} buttonAction={"Close"}/>
          </div>)
          }
          {completing && (<div>
            <Dialog open={completing} onClose={() => {{
              setCompleting(false);
              settoBeUpdated(null);
            }}}>
              <DialogTitle>Complete Appointment</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to complete this appointment?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setCompleting(false);
                  settoBeUpdated(null);
                }}>Close</Button>
                <Button onClick={() => {
                  CompleteAppointment(toBeUpdated._id);
                  setCompleting(false);
                  settoBeUpdated(null);
                }}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>)
          }
          {invalidComplete && (<div>
            <Message condition={invalidComplete} setCondition={setInvalidComplete} title={"Invalid Action"} message = {toBeUpdated.status ==='upcoming' || toBeUpdated.status === 'rescheduled' ? "You can only complete past Appointments" : "You can only complete upcoming or rescheduled Appointments"} buttonAction={"Close"}/>
          </div>)
          }
        {added && (
          <div>
            <Dialog open={added} onClose={() => {
              {
                setAdded(false);
                window.location.reload();
              }
            }}>
              <DialogTitle>Message</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Appointment Completed Successfully!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setAdded(false);
                  window.location.reload();
                }}>ok</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
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

CustomersTable.propTypes = {
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
