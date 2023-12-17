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
  Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,

  Button
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import axios from 'axios';
import { useState } from 'react';
import { set } from 'lodash';
import Cookies from 'js-cookie';

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;
  const username = Cookies.get('username');
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const [toBeUpdated, setToBeUpdated] = useState(null);
  const[loading, setLoading] = useState(false);
  const accept = async (appointment) => {
    console.log("in the accept");
    getUnreservedAppointments();
    setAccepting(true);
    setToBeUpdated(appointment);
  }

  const getUnreservedAppointments = async () => {
    setLoading(true);
    await axios.get('http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername='+username).then((res) => {
      setUnreservedAppointments(res.data.appointments);
      setLoading(false);
      console.log("in the getUnreserved");
    }).catch((err) => {
      console.log(err);
    });
  };


  const reject = async (appointment) => {
    setRejecting(true);
    setToBeUpdated(appointment);
  }

  const acceptRequest = async (appointmentId, appointmentPatient, oldAppointmentId) => {
    console.log("in the acceptRequest");
    console.log(appointmentId, appointmentPatient, oldAppointmentId);
    await axios.patch('http://localhost:8000/patient/bookAppointment?appointmentId='+appointmentId+'&patientUsername='+appointmentPatient+'&isRequested='+'true').then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });

    await axios.patch('http://localhost:8000/patient/updateAppointmentStatus?oldAppointmentId='+oldAppointmentId).then(res => {
        console.log(res);
        window.location.reload();
    }).catch(err => {
        console.log(err);
    });
    
  }


  const rejectRequest = async (appointment) => {
    console.log("in the rejectRequest");
    console.log(appointment);
    await axios.patch('http://localhost:8000/patient/updateAppointmentStatus?oldAppointmentId='+appointment._id).then(res => {
        console.log(res);
        window.location.reload();
    }).catch(err => {
        console.log(err);
    });
}

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
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
                    Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((appointment) => {
                const isSelected = selected.includes(appointment.id);

                return (
                  <TableRow
                    hover
                    key={appointment.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(appointment.id);
                          } else {
                            onDeselectOne?.(appointment.id);
                          }
                        }}
                      />
                    </TableCell>
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
                    <Stack
                        direction="row"
                        spacing={2}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => accept(appointment)}
                        >
                          Accept
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => reject(appointment)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        {rejecting && (
            <Dialog open={rejecting} onClose={() => setRejecting(false)}>
                <DialogTitle>Reject Follow-up Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to reject this request?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejecting(false)}>Close</Button>
                    <Button color='error' onClick={() => {rejectRequest(toBeUpdated)}}>Reject</Button>
                </DialogActions>
            </Dialog>
        )}
        {accepting && (
            <Dialog open={accepting} onClose={() => setAccepting(false)}>
                <DialogTitle>Accept Follow-up Request</DialogTitle>
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
                      <Button onClick={() => {acceptRequest(appointment._id, toBeUpdated.patient, toBeUpdated._id)}}>Pick Slot</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
                )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAccepting(false)}>Close</Button>
                </DialogActions>
            </Dialog>
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
