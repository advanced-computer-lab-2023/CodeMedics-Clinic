import PropTypes from 'prop-types';
import { format } from 'date-fns';
import IdentificationIcon from '@heroicons/react/24/solid/IdentificationIcon';
import Xmark from '@heroicons/react/24/solid/XMarkIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import {
  Avatar,
  Box,
  Card,
  Checkbox, IconButton,
  Stack, SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,Button,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useState } from 'react';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { indigo } from '../../../theme/colors';
import { PatientPopup } from '../Popup-generic';
import axios from 'axios';
export const PatientTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const [isOpenEmergencyContact, setIsOpenEmergencyContact] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  Name
                </TableCell>
                <TableCell >
                  Email
                </TableCell>
                <TableCell>
                  Gender
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Date of Birth
                </TableCell>
                <TableCell>
                  Password
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');
                return (
                  <TableRow hover key={customer.id}>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.Name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.Name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.Email}
                    </TableCell>
                    <TableCell>
                      {customer.Gender}
                    </TableCell>
                    <TableCell>
                      {customer.Number}
                    </TableCell>
                    <TableCell>
                      {customer.Username}
                    </TableCell>
                    <TableCell>
                      {customer.DateOfBirth.toString().substring(0, 10)}
                    </TableCell>
                    <TableCell>
                      {customer.Password}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" style={{ backgroundColor: '#ffdddd', color: 'black', marginBottom: '10px' }} 
                      onClick={() => {
                          const userName = customer.Username;
                          axios.post('http://localhost:8000/admin/removePatient', {Username: customer.Username})
                          .then((res) => {
                            if (res.status == 200) {
                              console.log("removed"); 
                              window.location.reload();
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          }
                          )
                        }}>
                        Remove
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

PatientTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
