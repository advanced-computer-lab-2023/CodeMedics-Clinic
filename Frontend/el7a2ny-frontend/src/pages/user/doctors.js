import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewDoctors } from 'src/sections/overview/overview-doctors';
import { DoctorsSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState , useEffect } from 'react';

const now = new Date();

const Page = ({ doctors , sepcialities }) => {

  const [filterSpeciality , setFilterSpeciality] = useState(doctors);
  const [search , setSearch] = useState(doctors);
  const [data, setData] = useState(doctors);
  

  useEffect(() => {
    handleData();
  }, [search , filterSpeciality]);

  const handleData = () => {
    setData(doctors.filter((doctor) => search.includes(doctor) && filterSpeciality.includes(doctor)));
  };

  const handleSearch = (str) => {
    if(str === ""){
      setSearch(doctors);
    }else{
      setSearch(doctors.filter((doctor) => {
        const fullName = doctor.FirstName + " " + doctor.LastName;
        return fullName.toLowerCase().includes(str.toLowerCase());
      }));
    }
  };

  const handleSpecialityFilter = (str) => {
    if(str === "None"){
      setFilterSpeciality(doctors);
    }else{
      setFilterSpeciality(doctors.filter((doctor) => {
        return doctor.Speciality === str;
      }));
    }
  }

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
          Doctors
        </Typography>
        <DoctorsSearch handleSearch={handleSearch} sepcialities={sepcialities} handleSpecialityFilter={handleSpecialityFilter}/>
        <Grid container spacing={3}>
          <Grid xs={20} md={20} lg={15}>
            <OverviewDoctors doctors={data} sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps() {
  try {
    // Fetch data from the provided API
    const response = await axios.get('http://localhost:8000/doctor/getDoctors');
    const doctors = response.data;
    const sepcialities = [{value: "None", label: "None"}];
    for(let i=0; i<doctors.length; i++){
      if(!sepcialities.includes(doctors[i].Speciality)){
        sepcialities.push({value: doctors[i].Speciality, label: doctors[i].Speciality});
      }
    }
    return {
      props:  {doctors , sepcialities} ,
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return {
      props: { doctors: [] }, // Return an empty array in case of an error
    };
  }
}

export default Page;
