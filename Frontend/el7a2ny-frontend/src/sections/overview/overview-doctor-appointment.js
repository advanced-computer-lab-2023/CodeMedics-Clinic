import PropTypes from 'prop-types';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import Link from 'next/link';



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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
                            <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => {
                                router.push(`/doctor/rescheduleAppointment?username=${patientUsername}&appointmentID=${appointment._id}`)
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
