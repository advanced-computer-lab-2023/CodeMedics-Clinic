import PropTypes from 'prop-types';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Message from 'src/components/Message';


import Cookies from 'js-cookie';
import {
  Avatar,
  Box,
  Card,
  Button,
  Checkbox,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  SvgIcon,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tooltip,
  Typography,
  TextField
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const AppointmentsTable = (props) => {
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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [amount, setAmount] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calcAmount = (appointmentId) =>{
    axios.get('http://localhost:8000/patient/getAppointmentAmount').then((res) =>{
      return res['data']
    }).then((data) =>{
      setAmount(data.amount);
    }).catch((err) => {
      console.log(err.message);
      setShowError(true);
      setErrorMessage(err.message);
    })
  }

  const acceptBooking = () =>{
    router.push(`/user/MyPay?appointmentId=${toBeBooked._id}&patientUsername=${curUsername}`)
  } 

  const [familyMembers, setFamilyMembers] = useState([{familyMember: {Username: Cookies.get('username'), FirstName: "me", LastName: ""}, relation: 'me'}]);
  useEffect(() => {
    axios.get('http://localhost:8000/patient/familyMembers', {withCredentials: true})
      .then((req) => {
        console.log("in family members");
        console.log(req.data.familyMembers);
        let temp = [];
        temp.push({familyMember: {Username: Cookies.get('username'), FirstName: "me", LastName: ""}, relation: 'me'});
        for(let i=0; i<req.data.familyMembers.length; i++){
          temp.push(req.data.familyMembers[i]);
        }
        setFamilyMembers(temp);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.message);
      });
  }, []);

  const [toBeBooked, setToBeBooked] = useState(); 
  const [isBooking, setIsBooking] = useState(false);
  const [curUsername, setCurUsername] = useState(Cookies.get('username'));
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
                  Book
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
                          {new Date(appointment.date).toLocaleDateString()}
                        </Typography>
                      </Stack>
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
                    <TableCell padding="checkbox">
                      <Stack direction="row">
                      <Tooltip title="Book Appointment" sx={{mt:1 , mr:5}}>
                        <IconButton
                          children={(
                            <SvgIcon fontSize="small">
                              <CheckIcon />
                            </SvgIcon>
                          )}
                          color="primary"
                          onClick={() => {
                              setIsBooking(true);
                              setToBeBooked(appointment)
                          }}
                        >
                        </IconButton >
                      </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        {isBooking && (<div>
            <Dialog open={isBooking} onClose={() => {{
                  setIsBooking(false);
                  setToBeBooked(null);
                  }}}>
              <DialogTitle>Choose to Book For</DialogTitle>
              <DialogContent>
              {familyMembers && <TextField
          sx={{width: 200}}
          id="Patient"
          select
          fullWidth
          label="Patient"
          defaultValue= {curUsername}
          helperText=""
          onChange={(str) => {setCurUsername(str.target.value)}}
        >
        {familyMembers && familyMembers.map((option) => (
            <MenuItem key={option.familyMember.Username} value={option.familyMember.Username} >
              {option.familyMember.FirstName + " " + option.familyMember.LastName}
            </MenuItem>
          ))}
    </TextField>}
              </DialogContent>
              <DialogActions>
              <Button onClick={() => {
                  setIsBooking(false);
                  acceptBooking();
                  }}>Continue</Button>
                <Button color='error'  onClick={() => {
                  setIsBooking(false);
                  setToBeBooked(null);
                  }}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>)
          }
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

AppointmentsTable.propTypes = {
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
