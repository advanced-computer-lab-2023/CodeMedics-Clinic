import PropTypes from 'prop-types';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';


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

  return (
    <Card>
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
                          {appointment.date}
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
                      <TextField
                        sx={{ width: 200 }}
                        id="Status"
                        select
                        fullWidth
                        label="Book Appointment"
                        helperText=""
                        onChange={(str) => { setState3(str.target.value) }}
                      >
                      </TextField>
                      <Tooltip title="Book Appointment" sx={{mt:1 , ml:2}}>
                        <IconButton
                          children={(
                            <SvgIcon fontSize="small">
                              <CheckIcon />
                            </SvgIcon>
                          )}
                          color="primary"
                          onClick={() => {
                            axios.patch(`http://localhost:8000/patient/bookAppointment?appointmentId=${appointment._id}&patientUsername=${Cookies.get('username')}`)
                            router.push(`/user/doctors`);
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
