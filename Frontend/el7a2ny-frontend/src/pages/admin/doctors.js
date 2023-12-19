import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/admin/layout';
import { DoctorsTable } from 'src/sections/admin/Doctors/DoctorsTable';
import { DoctorSearch } from 'src/sections/admin/Doctors/DoctorsSearch';
import { applyPagination } from 'src/utils/apply-pagination';
import Message from 'src/components/Message';

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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/admin/viewDoctors')
      .then((res) => {
        if (res.status == 401) {
          throw new Error('Error while fetching data');
        }
        return res.json();
      })
      .then((data) => {
        if (data['doctors']) {
          console.log(data['doctors']);
        setData(data['doctors']);
        }
  })
    .catch((err) => {
      setShowError(true);
      setErrorMessage(err.message);
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
        Doctors
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
                Doctors
              </Typography>
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowUpOnSquareIcon/>
                    </SvgIcon>
                  )}
                >
                  Import
                </Button>
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowDownOnSquareIcon/>
                    </SvgIcon>
                  )}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <DoctorSearch />
          <DoctorsTable
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
