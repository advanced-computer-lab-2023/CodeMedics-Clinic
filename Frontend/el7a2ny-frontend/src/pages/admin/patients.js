import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/admin/layout';
import { PatientTable } from 'src/sections/admin/Patients/Patient-Table';
import { PatientsSearch } from 'src/sections/admin/Patients/patients-search';
import { applyPagination } from 'src/utils/apply-pagination';
import Message from 'src/components/Miscellaneous/Message';

const axios = require('axios');

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(data, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/admin/viewPatients') // done new Route
      .then((res) => {
        if (res.status == 401) {
          throw new Error('Error while fetching data');
        }
        return res.json();
      })
      .then((data) => {
        if (data['patients']) {
          console.log(data['patients']);
        setData(data['patients']);
        }
  })
    .catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.message);
    });
}, []);
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
        Patients
      </title>
    </Head>
    <Message condition={showError} setCondition={setShowError} message={errorMessage} title="Error" buttonAction="Close" />
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
                Patients
              </Typography>
            </Stack>
          </Stack>
          <PatientsSearch/>
          <PatientTable
            count={data.length}
            items={customers}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </Stack>
      </Container>
    </Box>
  </>
);
}
;

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
