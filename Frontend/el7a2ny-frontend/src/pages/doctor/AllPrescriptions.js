import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import { useRouter } from 'next/navigation';
import { DocPrescriptionsFilter } from 'src/sections/user/prescriptions-filter-doctor';
import { DoctorPrescriptionsTable } from 'src/sections/overview/overview-latest-prescriptions-doctor';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
import Message from 'src/components/Message';

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
const now = new Date();

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};
const Page = () => {

  const [data, setData] = useState([]);
  const [allData , setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(data, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/doctor/getAllPrescriptions`, { withCredentials: true })
      .then((req) => {
        console.log(req.data);
        const prescriptions = req.data;
  
        prescriptions.sort((a, b) => {
          if (new Date(a.Date) < new Date(b.Date)) return -1;
          if (new Date(a.Date) > new Date(b.Date)) return 1;
          return 0;
        });
  
        setAllData(prescriptions);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);
  
  const [filter1, setFilter1] = useState('');
  const [filter2, setFilter2] = useState('');
  const [filter3, setFilter3] = useState('');
  const [patient, setPatient] = useState('');

  useEffect(() => {
    const filtered = allData.filter((prescription) => {
      if (filter1 === '' && filter2 === '' && filter3 === '' && patient === '') {
        return true;
      }
  
      const dateCondition =
        (filter1 === '' || prescription.Date >= filter1) &&
        (filter2 === '' || prescription.Date <= filter2);
  
      const filledCondition = filter3 === '' || prescription.filled === filter3;
  
      const patientCondition = patient === '' || prescription.Patient.toLowerCase().includes(patient.toLowerCase());
  
      return dateCondition && filledCondition && patientCondition;
    });
  
    setData(filtered);
  }, [filter1, filter2, filter3, patient, allData]);


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

  return (
    <>
      <Head>
        <title>
          Prescriptions
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
                  Prescriptions
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
            </Stack>
            <DocPrescriptionsFilter setFilterStartDate={setFilter1} setFilterEndDate={setFilter2} setFilledStatus={setFilter3} setPatient={setPatient} />
            {loading ? <LoadingSpinner /> : (
              <>
              {data.length === 0 ? <NoRecords message = {"No Prescriptions Found"}/> : 
              <DoctorPrescriptionsTable
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />}
              </>
            )}
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
