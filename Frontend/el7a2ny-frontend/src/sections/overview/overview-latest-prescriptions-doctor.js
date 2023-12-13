import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';
import { Scrollbar } from 'src/components/scrollbar';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import axios from 'axios';
import Cookies from 'js-cookie';

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

    // Set the patientUsername and initial values in the newprescriptionData state
    setPrescriptionData((prevData) => ({
      ...prevData,prescriptionID:prescriptionId,
      medicineName:medName
    }));
  };

  const handleSaveClick = async (prescriptionId) => {
    // Implement the logic to save the edited drug name and dosage
    // You can use axios.post to update the backend
    setEditablePrescriptionId(null);
    setEditableMedicineIndex(null);
    setPrescriptionData({});
    console.warn('hi');
    console.warn(newprescriptionData);

    // Add logic here to update the specific medicine in the prescription
    axios
      .post(`http://localhost:8000/doctor/addMedicineDosage`, newprescriptionData, { withCredentials: true })
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
                return (
                  <TableRow hover key={prescription._id}>
                    <TableCell>
                      {prescription.Drug.map((drug, medicineIndex) => (
                        <div key={medicineIndex}>
                          <Typography variant="body1">
                            {drug.drugName}
                          </Typography>
                          <Typography variant="body2">
                            Dosage: {drug.dosage}
                          </Typography>
                          {editablePrescriptionId === prescription._id && editableMedicineIndex === medicineIndex && (
                            <div>
                              <input
                                type="text"
                                value={newprescriptionData.dosage}
                                onChange={(e) => handleInputChange('dosage', e.target.value)}
                              />
                              <Button onClick={() => handleSaveClick(prescription._id)}>
                                Save
                              </Button>
                              <Button onClick={handleCancelClick}>
                                Cancel
                              </Button>
                            </div>
                          )}
                          {editablePrescriptionId !== prescription._id && editableMedicineIndex !== medicineIndex && (
                            <Button onClick={() => handleEditClick(prescription._id, medicineIndex,drug.drugName)}>
                              Edit
                            </Button>
                          )}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {prescription.Patient}
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
                      <Button onClick={() => downloadPDF(prescription)}>
                        Download PDF
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

DoctorPrescriptionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
