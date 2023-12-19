import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import { useRouter } from 'next/navigation';
import { PrescriptionsFilter } from 'src/sections/user/prescriptions-filter';
import { PatientPrescriptionsTable } from 'src/sections/overview/overview-latest-prescriptions';
import axios from 'axios';
import Cookies from 'js-cookie';
import Message from 'src/components/Message';

import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/patient/prescriptions', { withCredentials: true })
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
  const [doctor, setDoctor] = useState('');

  useEffect(() => {
    const filtered = allData.filter((prescription) => {
      if (filter1 === '' && filter2 === '' && filter3 === '' && doctor === '') {
        return true;
      }
  
      const dateCondition =
        (filter1 === '' || prescription.Date >= filter1) &&
        (filter2 === '' || prescription.Date <= filter2);
  
      const filledCondition = filter3 === '' || prescription.filled === filter3;
  
      const doctorCondition = doctor === '' || prescription.Doctor.toLowerCase().includes(doctor.toLowerCase());
  
      return dateCondition && filledCondition && doctorCondition;
    });
  
    setData(filtered);
  }, [filter1, filter2, filter3, doctor, allData]);


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
            <PrescriptionsFilter setFilterStartDate={setFilter1} setFilterEndDate={setFilter2} setFilledStatus={setFilter3} setDoctor={setDoctor} />
            {loading ? <LoadingSpinner /> : (
              data.length == 0 ? <NoRecords message={"No Prescriptions Found"}/> : <PatientPrescriptionsTable
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
              canFill={true}
            />
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
