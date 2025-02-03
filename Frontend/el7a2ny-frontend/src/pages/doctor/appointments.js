import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, TextField, Dialog, DialogContent, DialogContentText } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { CustomersTable } from 'src/sections/customer/appointment-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { DoctorSearch } from 'src/sections/admin/Doctors/DoctorsSearch';
import { useRouter } from 'next/navigation';
import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
import  Message from 'src/components/Miscellaneous/Message';
import { DialogActions, DialogTitle } from '@mui/material';
import { set } from 'lodash';
const now = new Date();


const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const customers = useCustomers(page, rowsPerPage);
  // const customersIds = useCustomerIds(customers);
  // const customersSelection = useSelection(customersIds);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  // console.log(selectedDate);
  const [startHour, setStartHour] = useState('09:00'); // Initial start hour
  const [endHour, setEndHour] = useState('17:00'); // Initial end hour
  const [searchData, setSearchData] = useState(appointments);
  // const [filteredData , setFilteredData] = useState(appointments);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [invalidDate, setInvalidDate] = useState(false);
  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = () =>{
    setLoading(true);
    axios({
      method: 'GET',
      url: 'http://localhost:8000/doctor/getAllDocAppointments',
      withCredentials: true
    })
    .then((response => {
      console.log("APPOINTMENTS___", response.data);
      setAppointments(response.data);
      setSearchData(response.data);
      setLoading(false);
    }))
    .catch(error => {
      console.log(error);
    })
  };

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  

  const handleDateChange = (event) => {
    console.log(event.target.value);
    setSelectedDate(event.target.value);
  };

  const handleStartHourChange = (event) => {
    setStartHour(event.target.value);
  };

  const handleEndHourChange = (event) => {
    setEndHour(event.target.value);
  };
  const [waiting, setWaiting] = useState(false);
  const [added, setAdded] = useState(false);
  const addAppointment = async (startHour, endHour, date) => {
    if(!date){
      setInvalidDate(true);
      setMessage("Please choose a date!");
      return;
    }
    if(date < now){
      setInvalidDate(true);
      setMessage("You cannot add an appointment in the past!");
      return;
    }
    const appointmentDate = new Date(date);
    const today = new Date();
    if(appointmentDate.getDate() === today.getDate() && appointmentDate.getMonth() === today.getMonth() && appointmentDate.getFullYear() === today.getFullYear() && startHour < today.getHours()){
      setInvalidDate(true);
      setMessage("You cannot add an appointment in the past!");
      return;
    }


    setWaiting(true);
    await axios('http://localhost:8000/doctor/addAppointments', {
      method: 'POST',
      withCredentials: true,
      data: {startHour, endHour, endHour, date, date}
    }).then((res) => {
      setWaiting(false);
      setAdded(true);
    }).catch((err) => {
      setInvalidDate(true);
      setMessage(err.response.data.message);
      console.log(err);
    });
  }

  const handleSearch = (str) => {
    if(str === ""){
      setSearchData(appointments);
    }
    else{
      console.log(appointments);
      setSearchData(appointments.filter((appointment) => appointment.patient && appointment.patient.toLowerCase().includes(str.toLowerCase())));
    }
  }

  const handleFilter  = (str)  => {
    if(str === "None"){
      setSearchData(appointments);
    }
    else{
      console.log(searchData)
  
      setSearchData(appointments.filter((appointment) => appointment.status === (str)));
    }
  }

  console.log(searchData);


  return (
    <>
      <Head>
        <title>
          Appointments
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Appointments
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Box sx={{ ml: 'auto' }}>
                    {/* Date selector */}
                    <TextField
                      type="Date"
                      label="Date"
                      id='appDate'  
                      value={selectedDate ? selectedDate : new Date()}
                      onChange={handleDateChange}
                    />
                  </Box>
                  {/* Start Hour selector */}
                  <TextField
                    type="time"
                    label="Start Hour"
                    value={startHour}
                    onChange={handleStartHourChange}
                    sx={{ ml: 1 }}
                  />
                  {/* End Hour selector */}
                  <TextField
                    type="time"
                    label="End Hour"
                    value={endHour}
                    onChange={handleEndHourChange}
                    sx={{ ml: 1 }}
                  />
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={() => { addAppointment(startHour, endHour, selectedDate) }}
                >
                  Add Appointment
                </Button>
              </div>
            </Stack>
            <DoctorSearch data={searchData} handleSearch={handleSearch} handleFilter={handleFilter}/>
            {loading? <LoadingSpinner /> : (
              <>
              {searchData.length === 0 ? <NoRecords message={"No Appointments Found"} /> : (
                <CustomersTable
                count={searchData.length}
                items={searchData}
                // onDeselectAll={customersSelection.handleDeselectAll}
                // onDeselectOne={customersSelection.handleDeselectOne}
                // onPageChange={handlePageChange}
                // onRowsPerPageChange={handleRowsPerPageChange}
                // onSelectAll={customersSelection.handleSelectAll}
                // onSelectOne={customersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                // selected={customersSelection.selected}
              />
              )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
      {waiting && (
        <Dialog>
          <LoadingSpinner />
        </Dialog>
      )}
      {added && (
        <div>
        <Dialog open={added} onClose={() => {{
              setAdded(false);
              router.refresh();
              }}}>
          <DialogTitle>Message</DialogTitle>
          <DialogContent>
            <DialogContentText>
                Appointment Added Successfully!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setAdded(false);
              router.refresh();
              }}>ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      )}

      {invalidDate && <Message condition={invalidDate} setCondition={setInvalidDate} title={"Invalid Action"} message={message} isError={true} buttonAction={"OK"} />}

    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
