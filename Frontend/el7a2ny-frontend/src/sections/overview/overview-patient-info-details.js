import { useCallback, useState, createRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useRouter } from 'next/navigation';

export const OverviewPatientInfoDetails = ({patient}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleAddHealthRecord = useCallback(() => {
    // Add logic to handle the selected file
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      
    } else {
      console.log('No file selected');
    }
  }, [selectedFile]);

  const handleAddHealthRecordButtonClick = () => {
    // Trigger the click event on the hidden file input
    fileInputRef.current.click();
    //handleAddHealthRecord();
  };
  const router = useRouter();
  // Create a ref for the file input
  const fileInputRef = createRef();


  

  return (
    <Card>
      <CardHeader
        title={patient.FirstName + "'s Profile"}
      />
      <CardContent sx={{ pt: 0 }}>
        {Object.keys(patient).length !== 0 && 
        <Box sx={{ m: -1.5 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                value={patient.FirstName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                value={patient.LastName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={patient.Email}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={patient.DateOfBirth}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  //onClick={handleScheduleFollowUp}
                >
                  Schedule a Follow Up
                </Button>
              </Grid>

              {/* View Health Records button */}
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push(`/doctor/medical-history?username=${patient.Username}`)
                  }}
                >
                  View Health Records
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push(`/doctor/prescriptions?username=${patient.Username}`)
                  }}
                >
                  View Prescriptions
                </Button>
            </Grid>
            <Grid  item xs={12} md={12}>
                <input
                    type="file"
                    accept=".pdf, .doc, .docx" // Specify the allowed file types
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </Grid>
          </Grid>
        </Box>}
      </CardContent>
      <Divider />
    </Card>
  );
};
