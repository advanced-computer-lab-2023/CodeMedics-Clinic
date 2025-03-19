import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';
import { Scrollbar } from 'src/components/scrollbar';
import { Button, IconButton, SvgIcon } from '@mui/material';
import FileSaver from 'file-saver';
import axios from 'axios';
import Message from 'src/components/Miscellaneous/Message';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';


import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';

import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';

const statusMap = {
  filled: 'success',
  unfilled: 'warning',
};

export const PatientPrescriptionsTable = (props) => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    canFill
  } = props;

  const downloadPDF = async (prescription) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/patient/download-prescription-pdf`,
        { prescription },
        { responseType: 'blob' } // Ensure responseType is set to 'blob' to handle binary data
      );
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `Prescription_${prescription._id}.pdf`;
  
      // Use FileSaver to trigger the download
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
  };

  const fillPrescription = async (prescriptionID) => {
    try {
        await axios.patch(`http://localhost:8000/patient/fillPrescription`, 
          {
              Username: username,
              prescriptionID: prescriptionID
          }
        ).then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Error filling prescription:', error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
  };


  const [prescriptionStatus, setPrescriptionStatus] = useState(items);
  const username = Cookies.get('username');

  const [viewing, setViewing] = useState(false);
  const [toBeUpadted, setToBeUpdated] = useState({});
  return (
    <Card>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
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
                  Status
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((prescription) => {  
                const status = prescription.filled?'filled':'unfilled';
                return (
                  <TableRow hover key={prescription._id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {prescription.Doctor}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {prescription.Date}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[status]}>
                        {status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <IconButton title='View Prescription' onClick={() => {
                        setViewing(true);
                        setToBeUpdated(prescription);
                      }}>
                        <SvgIcon fontSize="small">
                          <EyeIcon />
                        </SvgIcon>
                      </IconButton>
                      {canFill && 
                        <IconButton disabled={prescription.filled} title='Fill Prescription' onClick={() => {fillPrescription(prescription._id)}}>
                          <SvgIcon fontSize="small">
                            <CheckCircleIcon />
                          </SvgIcon>
                        </IconButton>
                      }
                      <IconButton title='Download as PDF' onClick={() => downloadPDF(prescription)}>
                        <SvgIcon fontSize="small">
                          <ArrowDownTrayIcon />
                        </SvgIcon>
                      </IconButton>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        {viewing && (
          <Dialog open={viewing} onClose={() => {
            setViewing(false);
          }} sx={{minWidth: 200}} fullWidth>
          <DialogTitle>Prescription</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Drug</TableCell>
                  <TableCell>Dosage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {toBeUpadted.Drug.map((drug, medicineIndex) => (
              <TableRow hover key={medicineIndex}>
                <TableCell>{drug.drugName}</TableCell>
                <TableCell>
                <TextField
                      type="text"
                      label="Dosage"
                      value={drug.dosage}
                      disabled={false}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
            setViewing(false);
          }}>Close</Button>
          </DialogActions>
        </Dialog>

        )}

        {errorMessage && (
          <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
        )}
        
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

PatientPrescriptionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
