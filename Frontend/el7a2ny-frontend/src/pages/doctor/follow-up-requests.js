import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, TextField } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { CustomersTable } from 'src/sections/customer/requests-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { DoctorSearch } from 'src/sections/admin/Doctors/DoctorsSearch';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { set } from 'lodash';
import Message from 'src/components/Message';
const now = new Date();


const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [appointments, setAppointments] = useState([]);
  const [searchData, setSearchData] = useState(appointments);
  // const [filteredData , setFilteredData] = useState(appointments);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    getAppointments();
  }, []);

  const username = Cookies.get('username');

  const getAppointments = () =>{
    axios({
      method: 'GET',
      url: 'http://localhost:8000/doctor/getFollowRequests?username='+username,
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
      setShowError(true);
      setErrorMessage(error.response.data.message);
    })
  };

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
  console.log("searchData");
  console.log(searchData);


  return (
    <>
      <Head>
        <title>
          Follow-up Requests
        </title>
      </Head>
      <Message condition={showError} setCondition={setShowError} title={"Error"} message={errorMessage} buttonAction={"Close"} />
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
                    Follow-up Requests
                </Typography>
              </Stack>
            </Stack>
            <DoctorSearch data={searchData} handleSearch={handleSearch} handleFilter={handleFilter} skipFiltering ={true}/>
            {!loading && (<CustomersTable
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
            />)}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
