import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';
import { Scrollbar } from 'src/components/scrollbar';
import { Button, IconButton, Input, SvgIcon, Tab } from '@mui/material';
import FileSaver from 'file-saver';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Avatar,Box,Card,Stack,Table,TableBody,TableCell,TableHead,TablePagination,
  TableRow,Typography,Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
  DialogActions} from '@mui/material';
  
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';

import { set } from 'lodash';
import { Form } from 'formik';
import { InputRounded } from '@mui/icons-material';


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
      setErrorMessage('An error occurred while downloading this prescription. Please try again later.');
    }
  };
  const[dosage, setDosage] = useState(null);
  const [medName, setMedName] = useState(null);
  const handleEditClick = (prescriptionId, medicineIndex, medName, dos) => {
    setEditablePrescriptionId(prescriptionId);
    setEditableMedicineIndex(medicineIndex);
    if(dos > 0)
      setDosage(dos);
    setMedName(medName);
    setPrescriptionData((prevData) => ({
      ...prevData,prescriptionID:prescriptionId,
      medicineName:medName
    }));
  };

  const handleDeleteMedicine = (prescriptionId,  medName) => {
    axios.post(`http://localhost:8000/doctor/removeMedicineFromPrescription`, 
    {
      prescriptionID: prescriptionId,
      medicineName: medName
    }, { withCredentials: true })
    .then((req) => {
      console.log(req.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error updating prescription:', error);
      setErrorMessage('An error occurred while deleting this medicine. Please try again later.');
    });
  };


const handleAddMedicine = (prescriptionId) => {
  setIsAddingMedicine(null);
  console.log("adding ", AddMedData);
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


  const handleSaveClick = async ({prescriptionId, keep}) => {
    setEditablePrescriptionId(null);
    if(!keep)
      setEditableMedicineIndex(null);
    setPrescriptionData({});
    axios.post(`http://localhost:8000/doctor/addMedicineDosage`, 
    {prescriptionID: toBeUpadted._id, 
      medicineName: medName,
      dosage: dosage
    }, { withCredentials: true })
      .then((req) => {
        console.log(req.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating prescription:', error);
        setErrorMessage('An error occurred while updating this prescription. Please try again later.');
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
  
  const [viewing, setViewing] = useState(false);
  const [toBeUpadted, setToBeUpadted] = useState({});

  
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((prescription) => {
                const status = prescription.filled ? 'filled' : 'unfilled';
  
                return (
                  <TableRow hover key={prescription._id}>
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
                    <IconButton title='Add Medicine' onClick={() => {
                          setIsAddingMedicine(true);
                          setToBeUpadted(prescription);
                        }}>
                          <SvgIcon fontSize="small">
                            <PlusIcon />
                          </SvgIcon>
                        </IconButton>
                    <IconButton title='View Prescription' onClick={() => {
                          setViewing(true);
                          setToBeUpadted(prescription);
                        }}>
                          <SvgIcon fontSize="small">
                            <EyeIcon />
                          </SvgIcon>
                        </IconButton>
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
        {isAddingMedicine && toBeUpadted && !toBeUpadted.filled && (
          <Dialog open={isAddingMedicine} onClose={() => 
            {
              setIsAddingMedicine(false);
              handleInputChange2('medicineName', "");
              handleInputChange2('dosage', "");
            }
          }>
          <DialogTitle>Add Medicine</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the medicine name and dosage you want to add.
            </DialogContentText>
            <Box>
              <TextField
                type="text"
                label="Medicine Name"
                value={AddMedData.medicineName}
                onChange={(e) => handleInputChange2('medicineName', e.target.value, toBeUpadted._id)}
                required
                fullWidth
                sx={{ marginBottom: 2, borderRadius: 4, marginTop: 2 }}
              />
              <TextField
                type="number"
                label="Dosage"
                value={AddMedData.dosage}
                onChange={(e) => handleInputChange2('dosage', e.target.value, toBeUpadted._id)}
                required
                fullWidth
                sx={{ borderRadius: 4 }}
                
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsAddingMedicine(false);
              handleInputChange2('medicineName', "");
              handleInputChange2('dosage', "");
            }}>Cancel</Button>
            <Button onClick={() => handleAddMedicine(toBeUpadted._id)} disabled={!AddMedData.medicineName || !AddMedData.dosage}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        
        )}
        
        {viewing && (
          <Dialog open={viewing} onClose={() => {
            setViewing(false);
            setMedName(null);
            setDosage(null);
            setEditableMedicineIndex(null);
          }} sx={{minWidth: 200}} fullWidth>
          <DialogTitle>Prescription</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Drug</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {toBeUpadted.Drug.map((drug, medicineIndex) => (
              <TableRow hover key={medicineIndex}>
                <TableCell>{drug.drugName}</TableCell>
                <TableCell>
                <TextField
                      type="number"
                      label="Dosage"
                      value={medicineIndex == editableMedicineIndex ? dosage || drug.dosage: drug.dosage}
                      disabled={false}
                      onChange={(e) => {
                        setEditableMedicineIndex(medicineIndex);
                        handleEditClick(toBeUpadted._id, medicineIndex, drug.drugName, e.target.value);
                    }}
                    />
                </TableCell>
                <TableCell>
                  <IconButton title='Save Dosage' onClick={() => {
                        handleSaveClick({keep: true});
                    }}>
                    <SvgIcon fontSize="small">
                      <PencilSquareIcon />
                    </SvgIcon>
                  </IconButton>

                  <IconButton title='Delete Medicine' onClick={() => handleDeleteMedicine(toBeUpadted._id, drug.drugName)}>
                    <SvgIcon fontSize="small">
                      <XMarkIcon />
                    </SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
          </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
            setViewing(false);
            setMedName(null);
            setDosage(null);
            setEditableMedicineIndex(null);
          }}>OK</Button>
          </DialogActions>
        </Dialog>
    
        )}

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
