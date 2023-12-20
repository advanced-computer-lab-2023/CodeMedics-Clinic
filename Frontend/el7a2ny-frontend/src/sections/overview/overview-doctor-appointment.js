import PropTypes from 'prop-types';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import Link from 'next/link';
import Message from 'src/components/Message';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


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
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LoadingSpinner from 'src/components/LoadingSpinner';

export const PatientAppointmentsTable = (props) => {

    const patientUsername = new URLSearchParams(window.location.search).get('username');

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
  const router = useRouter();
  const [rescheduling, setRescheduling] = useState(false);
  const [toBeUpdated, setToBeUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const rescheduleAppointment = (appointmentID, oldAppointment) => {
    axios.patch('http://localhost:8000/patient/RescheduleAppointment?appointmentID='+appointmentID+'&oldAppointmentID='+oldAppointment._id+'&username='+oldAppointment.patient)
    .then((req) => {
      window.location.reload();
    }).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.message);
    });
  }
  const statusMap = {
    upcoming: 'warning',
    cancelled: 'error',
    completed: 'success',
    rescheduled: 'warning'
  };  
  const username = Cookies.get('username');
  const getUnreservedAppointments = async () => {
    setLoading(true);
    await axios.get('http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername='+username).then((res) => {
      setUnreservedAppointments(res.data.appointments);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.message);
    });
  };
  return (
    <Card>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
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
                            <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => {
                              setRescheduling(true);
                              setToBeUpdated(appointment);
                              getUnreservedAppointments();
                              }}>
                            Reschedule
                            </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        {rescheduling && toBeUpdated.status !== 'upcoming' && toBeUpdated.status !== 'rescheduled' && (<div>
            <Dialog open={rescheduling} onClose={() => {{
                  setRescheduling(false);
                  setToBeUpdated(null);
                  setUnreservedAppointments([]);
                }}} >
              <DialogTitle>Reschedule</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You can only reschedule upcoming and rescheduled appointments
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setRescheduling(false);
                  setToBeUpdated(null);
                  setUnreservedAppointments([]);
                }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)}
        {rescheduling && (toBeUpdated.status === 'upcoming' || toBeUpdated.status === 'rescheduled') && (<div>
            <Dialog open={rescheduling} onClose={() => {{
                  setRescheduling(false);
                  setToBeUpdated(null);
                  setUnreservedAppointments([]);
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
                      <Button onClick={() => {rescheduleAppointment(appointment._id, toBeUpdated)}}>Reschedule</Button>
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
                  setToBeUpdated(null);
                  setUnreservedAppointments([]);
                }}>Close</Button>
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
