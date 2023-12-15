import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';
import { Scrollbar } from 'src/components/scrollbar';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Avatar,Box,Card,Stack,Table,TableBody,TableCell,TableHead,TablePagination,
  TableRow,Typography,Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions} from '@mui/material';

let doctorUsername = '';
const doctorUsernameCookie = Cookies.get('jwt');
if (doctorUsernameCookie) {
  try {
    const doctorUsernameObject = JSON.parse(doctorUsernameCookie);
    doctorUsername = doctorUsernameObject.username;
    console.log(doctorUsername);
  } catch (error) {
    console.error('Error parsing JWT cookie:', error);
  }
} else {
  console.warn('JWT cookie not found');
}

const statusMap = {
  filled: 'success',
  unfilled: 'warning',
};

export const DoctorPrescriptionsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const [editablePrescriptionId, setEditablePrescriptionId] = useState(null);
  const [editableMedicineIndex, setEditableMedicineIndex] = useState(null);
  const [newprescriptionData, setPrescriptionData] = useState({
    prescriptionID:'',
    medicineName: '',
    dosage: ''
  });
  const [DeleteMedData, setDeleteData] = useState({
    prescriptionID:'',
    medicineName: '',
  });
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [AddMedData, setAddData] = useState({
    prescriptionID:'',
    medicineName: '',
    dosage: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  


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
    }
  };


  const handleEditClick = (prescriptionId, medicineIndex, medName) => {
    setEditablePrescriptionId(prescriptionId);
    setEditableMedicineIndex(medicineIndex);
    setPrescriptionData((prevData) => ({
      ...prevData,prescriptionID:prescriptionId,
      medicineName:medName
    }));
  };

  const handleDeleteMedicine = (prescriptionId,  medName) => {
    setDeleteData((prevData) => ({
      ...prevData,prescriptionID:prescriptionId,
      medicineName:medName
    }));
    axios.post(`http://localhost:8000/doctor/removeMedicineFromPrescription`, 
    DeleteMedData, { withCredentials: true })
    .then((req) => {
      console.log(req.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error updating prescription:', error);
    });
};


const handleAddMedicine = (prescriptionId) => {
  setIsAddingMedicine(null);
  axios.post(`http://localhost:8000/doctor/addMedicineToPrescription`, AddMedData, { withCredentials: true })
    .then((req) => {
      console.log(req.data);
      window.location.reload();
    })
    .catch((error) => {
      setErrorMessage('An error occurred while adding this medicine. It is not available at CodeMedics Pharmacy');
      setOpenDialog(true);
    });
};


  const handleSaveClick = async (prescriptionId) => {
    setEditablePrescriptionId(null);
    setEditableMedicineIndex(null);
    setPrescriptionData({});
    axios.post(`http://localhost:8000/doctor/addMedicineDosage`, 
    newprescriptionData, { withCredentials: true })
      .then((req) => {
        console.log(req.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating prescription:', error);
      });
  };

  const handleInputChange = (field, value) => {
    setPrescriptionData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleInputChange2 = (field, value, prescriptionId) => {
    setAddData((prevData) => ({
      ...prevData,
      prescriptionID: prescriptionId,
      [field]: value,
    }));
  };
  
  const handleCancelClick = () => {
    setEditablePrescriptionId(null);
    setEditableMedicineIndex(null);
    setPrescriptionData({
      patientUsername: '',
      medicineName: '',
      dosage: '',
    });
  };
  
  
  
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Drug</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((prescription, prescriptionIndex) => {
                const status = prescription.filled ? 'filled' : 'unfilled';
                const isSelectedPrescription = selectedPrescriptionId === prescription._id;
  
                return (
                  <TableRow hover key={prescription._id}>
                    <TableCell>
                      {prescription.Drug.map((drug, medicineIndex) => (
                        <div key={medicineIndex} style={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            onClick={() => handleDeleteMedicine(prescription._id, drug.drugName)}
                            color="error"
                            size="small"
                          >
                            Remove
                          </Button>
                          <div style={{ marginLeft: '8px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1">{drug.drugName}</Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" style={{ marginRight: '8px' }}>
                                Dosage:
                              </Typography>
                              {editablePrescriptionId === prescription._id && editableMedicineIndex === medicineIndex && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" style={{ marginRight: '4px' }}>
                                    <input
                                      type="text"
                                      value={newprescriptionData.dosage}
                                      onChange={(e) => handleInputChange('dosage', e.target.value)}
                                    />
                                  </Typography>
                                  <Button onClick={() => handleSaveClick(prescription._id)} size="small">
                                    Save
                                  </Button>
                                  <Button onClick={handleCancelClick} size="small">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                              {editablePrescriptionId !== prescription._id || editableMedicineIndex !== medicineIndex ? (
                                <Typography variant="body2">{drug.dosage}</Typography>
                              ) : null}
                            </div>
                          </div>
                          {editablePrescriptionId !== prescription._id && editableMedicineIndex !== medicineIndex && (
                            <Button onClick={() => handleEditClick(prescription._id, medicineIndex, drug.drugName)} size="small">
                              Edit
                            </Button>
                          )}
                        </div>
                      ))}
                      {isSelectedPrescription && isAddingMedicine ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Medicine Name"
                            value={AddMedData.medicineName}
                            onChange={(e) => handleInputChange2('medicineName', e.target.value, prescription._id)}
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={AddMedData.dosage}
                            onChange={(e) => handleInputChange2('dosage', e.target.value, prescription._id)}
                          />
                          <Button onClick={() => setIsAddingMedicine(false)} size="small">
                            Cancel
                          </Button>
                          <Button onClick={() => handleAddMedicine(prescription._id)} size="small">
                            Save
                          </Button>
                        </div>
                      ) : null}
                      {!isAddingMedicine && !prescription.filled && (
                        <Button
                          onClick={() => {
                            setIsAddingMedicine(true);
                            setSelectedPrescriptionId(prescription._id);
                            setErrorMessage(null); 
                          }}
                          size="small"
                        >
                          Add Medicine
                        </Button>
                      )}
                      {errorMessage && (
                         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                         <DialogTitle>Error</DialogTitle>
                         <DialogContent>
                           <DialogContentText>{errorMessage}</DialogContentText>
                         </DialogContent>
                         <DialogActions>
                           <Button onClick={() => setOpenDialog(false)}>OK</Button>
                         </DialogActions>
                       </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{prescription.Patient}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{prescription.Date}</TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[status]}>{status}</SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => downloadPDF(prescription)}>Download PDF</Button>
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

DoctorPrescriptionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
