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
  TableHead, Button,
  TablePagination,
  TableRow, Alert,
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
export const AdminsTable = (props) => {
  const {
    count = 0,
    items = [],
    handleRemove,
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

  

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [isOpenEmergencyContact, setIsOpenEmergencyContact] = useState(false);
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
                          {customer.Name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.Username}
                    </TableCell>
                    <TableCell>
                      {customer.Email}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" style={{ backgroundColor: '#ffdddd', color: 'black', marginBottom: '10px' }} 
                      onClick={() => {
                        const userName = customer.Username;
                        handleRemove(userName);
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

AdminsTable.propTypes = {
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
