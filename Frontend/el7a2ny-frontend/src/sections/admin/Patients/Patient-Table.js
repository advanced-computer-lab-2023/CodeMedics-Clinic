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
  TablePagination,
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
                  Emergency Contact
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');
                const relation = customer.emergencyContact.relation;
                const fullName = customer.emergencyContact.fullName;
                const mobileNumber = customer.emergencyContact.mobileNumber;
                return (
                  <TableRow hover key={customer.id}>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.email}
                    </TableCell>
                    <TableCell>
                      {customer.gender}
                    </TableCell>
                    <TableCell>
                      {customer.mobileNumber}
                    </TableCell>
                    <TableCell>
                      {customer.username}
                    </TableCell>
                    <TableCell>
                      {customer.dob.substring(0, customer.dob.indexOf('T'))}
                    </TableCell>
                    <TableCell>
                      {customer.password}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setIsOpenEmergencyContact(true);
                        }}
                      >
                        <SvgIcon fontSize="large">
                          <IdentificationIcon/>
                        </SvgIcon>
                      </IconButton>
                      {customer.emergencyContact.fullName}
                      <PatientPopup
                        items={
                          {
                            fullName: fullName,
                            mobileNumber: mobileNumber,
                            relation: relation
                          }
                        }
                        width={'25%'} height={'15vh'}
                        isOpenEmergencyContact={isOpenEmergencyContact}
                        setIsOpenEmergencyContact={setIsOpenEmergencyContact}></PatientPopup>

                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                        }}
                      >
                        <SvgIcon fontSize="small">
                          <Xmark/>
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                        }}
                      >
                        <SvgIcon fontSize="small">
                          <PencilIcon/>
                        </SvgIcon>
                      </IconButton>
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
