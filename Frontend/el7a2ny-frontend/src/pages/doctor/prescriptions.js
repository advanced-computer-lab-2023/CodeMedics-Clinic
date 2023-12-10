import Head from 'next/head';
import { Box, Container, Button, Typography, TextField } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Cookies from 'js-cookie';

const PrescriptionPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // State for the prescription data
    const [prescriptionData, setPrescriptionData] = useState({
      doctorUsername: '',
      patientUsername: '',
      date: '',
      drugs: [
        {
          drugName: '',
          dosage: '',
        },
      ],
    });
  
    // State for success message
    const [successMessage, setSuccessMessage] = useState('');
  
    useEffect(() => {
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
  
      // Update the state only if the value has changed
      setPrescriptionData((prevData) => {
        if (prevData.doctorUsername !== doctorUsername) {
          return { ...prevData, doctorUsername: doctorUsername || '' };
        }
        return prevData;
      });
    }, []);
  
    const handleDateChange = (event) => {
      setPrescriptionData((prevData) => {
        const newData = { ...prevData, date: event.target.value };
        return newData;
      });
    };
  
    const handleChange = (field, index) => (event) => {
      setPrescriptionData((prevData) => {
        const newDrugs = [...prevData.drugs];
        newDrugs[index] = { ...newDrugs[index], [field]: event.target.value };
        const newData = { ...prevData, drugs: newDrugs };
        return newData;
      });
    };
    const handleChange2 = (field) => (event) => {
        setPrescriptionData((prevData) => {
          const newData = { ...prevData, [field]: event.target.value };
          console.log('Prescription Data:', newData);
          return newData;
        });
      };
  
    const handleAddDrug = () => {
      setPrescriptionData((prevData) => {
        const newDrugs = [...prevData.drugs, { drugName: '', dosage: '' }];
        const newData = { ...prevData, drugs: newDrugs };
        console.log('Prescription Data:', newData);
        return newData;
      });
    };
  
    const handlePrescriptionSubmit = async () => {
      try {
        setLoading(true);
        console.log('Prescription Data:', prescriptionData);
        const response = await axios.post(
          'http://localhost:8000/doctor/addPrescription',
          prescriptionData,
          {
            withCredentials: true,
          }
        );
  
        console.log('Prescription added successfully', response.data);
        setSuccessMessage('Prescription uploaded successfully!');
        //router.refresh();
      } catch (error) {
        console.error('Error adding prescription:', error);
        setError('Error adding prescription. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDialogClose = () => {
      setSuccessMessage('');
    };
  
  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
            Prescription Form
          </Typography>
          <form>
          {prescriptionData.drugs.map((drug, index) => (
          <div key={index}>
            <TextField
              label={`Drug Name ${index + 1}`}
              value={drug.drugName}
              onChange={handleChange('drugName', index)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label={`Dosage ${index + 1}`}
              value={drug.dosage}
              onChange={handleChange('dosage', index)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleAddDrug}
        >
          Add Drug
        </Button>
            <TextField
              label="Patient Username"
              value={prescriptionData.patientUsername}
              onChange={handleChange2('patientUsername')}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              value={prescriptionData.date}
              onChange={handleDateChange}
            />
       
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handlePrescriptionSubmit}
              disabled={loading}
            >
              Submit Prescription
            </Button>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Container>
      </Box>
     <Dialog open={!!successMessage} onClose={handleDialogClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>{successMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

PrescriptionPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PrescriptionPage;
