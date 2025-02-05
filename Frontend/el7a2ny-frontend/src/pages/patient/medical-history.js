import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Button, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewMedicalRecords } from 'src/sections/overview/overview-medical-records';
import { PatientsSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { SvgIcon } from '@mui/material';
import DocumentArrowUpIcon from '@heroicons/react/24/solid/DocumentArrowUpIcon';
import FileSaver from 'file-saver';
import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
import Message from 'src/components/Miscellaneous/Message';
const now = new Date();

const Page = () => {

  const router = useRouter();
  const username = Cookies.get('username');
  const [medicalRecords, setMedicalRecords] = useState([]); 
  const [loading , setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    axios(`http://localhost:8000/patient/${username}/health-records`, {
      method: 'GET',  
      withCredentials: true
    }).then(response => {
      console.log(response);
      setMedicalRecords(response.data.healthRecords);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    });
  }, []);

  console.log("My Records: ", medicalRecords);

  const handleUpload = async () => {
    try {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf, .doc, .docx, .png, .jpg, .jpeg';

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if (file) {
                const formData = new FormData();
                formData.append('document', file);

                try {
                    const response = await axios.post(
                        `http://localhost:8000/patient/${username}/MedicalHistoryUpload`,
                        formData,
                        {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    console.log('File uploaded successfully:', response);
                    router.refresh();
                    // Update the medical records state or perform any other necessary actions
                    // For example, you can fetch the updated records after successful upload
                    // and update the state accordingly.
                    // ...

                } catch (error) {
                    console.error('Error uploading file:', error);
                    setShowError(true);
                    setErrorMessage(error.response.data.message);
                }
            }
        });

        fileInput.click();
    } catch (error) {
        console.error('Error creating file input:', error);
        setShowError(true);
        setErrorMessage(error.response.data.message);
    }
};



  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {loading ? <LoadingSpinner /> : 
        (
          <>
          <Container maxWidth="xl">
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
            Medical History
            <Button
        component="span"
        size="medium"
        sx={{
          mt: 3,
          backgroundColor: '#F8F8F8',
          '&:hover': {
            backgroundColor: '#F1F1F1',
          },
        }}
        endIcon={(
          <SvgIcon fontSize="small">
            <DocumentArrowUpIcon />
          </SvgIcon>
        )}
        onClick={handleUpload} // Link the button to the handleUpload function
      >
        Upload Medical Records
      </Button>
          </Typography>
          {medicalRecords.length === 0 ? <NoRecords message={"No Medical History Found"} /> : <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <OverviewMedicalRecords medicalRecords={medicalRecords} sx={{ height: '100%' }} />
            </Grid>
          </Grid>}
        </Container>
          </>
        )}
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;