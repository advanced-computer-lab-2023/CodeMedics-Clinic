import Head from 'next/head';
import { Box, Container, Button, Typography, TextField } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Grid } from '@mui/material';
import Cookies from 'js-cookie';

const PrescriptionPage = () => {
    const router = useRouter();
    const username = new URLSearchParams(window.location.search).get('username');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState({
      doctorUsername: '',
      patientUsername: username,
      date: '',
      drugs: [
        {
          drugName: '',
          dosage: '',
        },
      ],
    });
    
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
  
    const handleAddNewDrugFields = () => {
      setPrescriptionData((prevData) => {
        const newDrugs = [...prevData.drugs, { drugName: '', dosage: '' }];
        const newData = { ...prevData, drugs: newDrugs };
        return newData;
      });
    };
    
    const handleRemoveDrugField = (index) => {
      setPrescriptionData((prevData) => {
        const newDrugs = [...prevData.drugs];
        newDrugs.splice(index, 1);
        return { ...prevData, drugs: newDrugs };
      });
    };

    const handlePrescriptionSubmit = async () => {
      try {
        console.log(prescriptionData);
        setLoading(true);
        let problematicDrug = null;
    
        // Iterate over each drug in prescriptionData and check medicine
        for (const drug of prescriptionData.drugs) {
          const response = await axios.post('http://localhost:8000/doctor/checkMedicine', {
            medicineName: drug.drugName,
          });
    
          if (!response.data.exists) {
            console.error(`Error: Drug ${drug.drugName} does not exist in the Pharmacy.`);
            problematicDrug = drug;
            break; // Stop the loop if a drug is not found
          }
        }
    
        // If a problematic drug is found, display an error and return
        if (problematicDrug) {
          console.error(`Error adding prescription. Drug ${problematicDrug.drugName} is not available.`);
          setError(`Error adding prescription. Drug ${problematicDrug.drugName} is not available.`);
          return;
        }
    
        // All drugs passed the check, proceed to submit prescription
        const response = await axios.post('http://localhost:8000/doctor/addPrescription', prescriptionData, {
          withCredentials: true,
        });
    
        console.log('Prescription added successfully', response.data);
        setSuccessMessage('Prescription uploaded successfully!');
        setError(null);
        //router.refresh();
      } catch (error) {
        console.error('Error adding prescription:', error);
    
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          console.error('No response received from the server');
        } else {
          console.error('Error during request setup:', error.message);
        }
    
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
            <Typography variant="h3" gutterBottom>
              Prescription Form
            </Typography>
            <form>
              {prescriptionData.drugs.map((drug, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={1}>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => handleRemoveDrugField(index)}
                        style={{
                          color: 'red',
                          marginLeft: '-8px', // Adjust this value as needed
                        }}
                      >
                        Remove
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label={`Drug Name ${index + 1}`}
                        value={drug.drugName}
                        onChange={handleChange('drugName', index)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label={`Dosage ${index + 1}`}
                        value={drug.dosage}
                        onChange={handleChange('dosage', index)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              ))}
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleAddNewDrugFields}
                style={{ marginTop: '16px' }}
              >
                +
              </Button>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    label="Date"
                    type="date"
                    name="date"
                    placeholder=" "
                    value={prescriptionData.date}
                    onChange={handleDateChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handlePrescriptionSubmit}
                disabled={loading}
                style={{ marginTop: '16px' }}
              >
                Submit Prescription
              </Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>}
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
