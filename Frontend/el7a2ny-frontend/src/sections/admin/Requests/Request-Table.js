import PropTypes from 'prop-types';
import { format } from 'date-fns';
import IdentificationIcon from '@heroicons/react/24/solid/IdentificationIcon';
import Xmark from '@heroicons/react/24/solid/XMarkIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';
import file from '../../../file.png'
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
  TableRow, Button,
  Typography,
  Tooltip,
  Link
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useEffect, useState } from 'react';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { indigo } from '../../../theme/colors';
import { PatientPopup } from '../Popup-generic';
import axios from 'axios';
import FileSaver from 'file-saver';
export const RequestTable = (props) => {
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

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [isOpenEmergencyContact, setIsOpenEmergencyContact] = useState(false);

  useEffect(() => {
    console.log(items.length);
  }, [items]);

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
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                {/* <TableCell>
                  Password
                </TableCell> */}
                {/* <TableCell>
                  Gender
                </TableCell> */}
                <TableCell>
                  HourlyRate
                </TableCell>
                <TableCell>
                  affiliation
                </TableCell>
                {/* <TableCell>
                  Date of Birth
                </TableCell> */}
                <TableCell>
                  edu 
                </TableCell>
                <TableCell>
                  Documents
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');
                return (
                  <TableRow
                    hover
                    key={customer.id}
                    selected={isSelected}
                  >
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
                          {customer.FirstName + " " + customer.LastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.Username}
                    </TableCell>
                    <TableCell>
                      {customer.Email}
                    </TableCell>
                    {/* <TableCell>
                      {customer.Password}
                    </TableCell> */}
                    <TableCell>
                      {customer.HourlyRate}
                    </TableCell>
                    <TableCell>
                      {customer.affiliation}
                    </TableCell>
                    {/* <TableCell>
                      {customer.dob.substring(0, customer.dob.indexOf('T'))}
                    </TableCell> */}
                    <TableCell>
                      {customer.Degree}
                    </TableCell>
                    <TableCell>
                    <Tooltip title="National ID">
                    <IconButton 
                      children ={(
                        <SvgIcon fontSize="small">
                          <ArrowDownTrayIcon />
                        </SvgIcon>
                      )}
                      color="primary"
                      onClick={() => {FileSaver.saveAs(`/uploads/${customer.IDDocument}`, `${customer.IDDocument}`);}}
                    >
                    </IconButton >
                    </Tooltip>
                    <Tooltip title="Medical License">
                    <IconButton 
                      children ={(
                        <SvgIcon fontSize="small">
                          <ArrowDownTrayIcon />
                        </SvgIcon>
                      )}
                      color="primary"
                      onClick={() => {FileSaver.saveAs(`/uploads/${customer.MedicalLicense}`, `${customer.MedicalLicense}`);}}
                    >
                    </IconButton >
                    </Tooltip>
                    <Tooltip title="Medical Degree">
                    <IconButton 
                      children ={(
                        <SvgIcon fontSize="small">
                          <ArrowDownTrayIcon />
                        </SvgIcon>
                      )}
                      color="primary"
                      onClick={() => {FileSaver.saveAs(`/uploads/${customer.MedicalDegree}`, `${customer.MedicalDegree}`);}}
                    >
                    </IconButton >
                    </Tooltip>
                    </TableCell>
                    <TableCell>
                    <Tooltip title="Accept Doctor">
                    <IconButton 
                      children ={(
                        <SvgIcon fontSize="small">
                          <CheckIcon />
                        </SvgIcon>
                      )}
                      color="primary"
                      onClick={() => {
                        const userName = customer.Username;
                        axios.post('http://localhost:8000/admin/acceptRejectDoctorRequest', {username: customer.Username, action: "accept"})
                        .then((res) => {
                          if (res.status == 200) {
                            console.log("accepted");
                            window.location.reload();
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        }
                        )
                      }}
                    >
                    </IconButton >
                    </Tooltip>
                    <Tooltip title="Reject Doctor">
                    <IconButton 
                      children ={(
                        <SvgIcon fontSize="small">
                          <XMarkIcon />
                        </SvgIcon>
                      )}
                      color="primary"
                      onClick={() => {
                        const userName = customer.Username;
                          axios.post('http://localhost:8000/admin/acceptRejectDoctorRequest', {username: customer.Username, action: "reject"})
                          .then((res) => {
                            console.log("should be rejected");
                            if (res.status == 200) {
                              console.log("rejected");
                              window.location.reload();
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          }
                          );
                      }}
                    >
                    </IconButton >
                    </Tooltip>
                    
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

RequestTable.propTypes = {
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
