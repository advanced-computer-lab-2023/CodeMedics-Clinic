import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { OverviewDoctors } from 'src/sections/overview/overview-doctors';
import { DoctorsSearch } from 'src/sections/doctor/doctor-search';
import axios from 'axios';
import { useState , useEffect } from 'react';

const now = new Date();

const Page = () => {

  const [filterSpeciality , setFilterSpeciality] = useState([]);
  const [searchDoctor , setSearchDoctor] = useState([]);
  const [searchSpeciality , setSearchSpeciality] = useState([]);
  const [data, setData] = useState([]);
  const [specialities , setSpecialities] = useState([])
  const [filterDate , setFilterDate] = useState([]);
  const [doctors , setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/doctor/getDoctorsAndAppointments' , {withCredentials: true})
    .then((response) => {
      return response.data.data;
    })
    .then((data) => {
      console.log(data);
      setDoctors(data);
      const sepciality = [{value: "None", label: "None"}];
      for(let i=0; i<data.length; i++){
        if(!sepciality.includes(data[i].doctor.Speciality)){
          sepciality.push({value: data[i].doctor.Speciality, label: data[i].doctor.Speciality});
        }
      }
      setSpecialities(sepciality);
      setSearchDoctor(data);
      setSearchSpeciality(data);
      setFilterSpeciality(data);
      setFilterDate(data);
      setData(data);
    })
    .catch((error) => {
      console.log(error);
    });
  },[]);
  

  useEffect(() => {
    handleData();
  }, [searchDoctor , filterSpeciality , searchSpeciality , filterDate]);

  const handleData = () => {
    setData(doctors.filter((doctor) => searchDoctor.includes(doctor) && filterSpeciality.includes(doctor) && searchSpeciality.includes(doctor)));
  };

  const handleDoctorSearch = (str) => {
    if(str === ""){
      setSearchDoctor(doctors);
    }else{
      setSearchDoctor(doctors.filter((doctor) => {
        const fullName = doctor.doctor.FirstName + " " + doctor.doctor.LastName;
        return fullName.toLowerCase().includes(str.toLowerCase());
      }));
    }
  };

  const handleSpecialitySearch = (str) => {
    if(str === ""){
      setSearchSpeciality(doctors);
    }else{
      setSearchSpeciality(doctors.filter((doctor) => doctor.doctor.Speciality.toLowerCase().includes(str.toLowerCase())));
    }
  };


  const handleSpecialityFilter = (str) => {
    if(str === "None"){
      setFilterSpeciality(doctors);
    }else{
      setFilterSpeciality(doctors.filter((doctor) => {
        return doctor.doctor.Speciality === str;
      }));
    }
  }

  const handleDateFilter = (date , h) => {
    if(date === ""){
      setSearchDoctor(doctors);
    }else{
      setSearchDoctor(doctors.filter((doctor) => {
        return doctor.appointments.some((appointment) => appointment.date === date && appointment.startHour <= h && appointment.endHour >= h);
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
        <DoctorsSearch 
          handleSpecialitySearch={handleSpecialitySearch} 
          handleDoctorSearch={handleDoctorSearch} 
          sepcialities={specialities} 
          handleSpecialityFilter={handleSpecialityFilter}
          handleDateFilter={handleDateFilter}
        />
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

export default Page;
