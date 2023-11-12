import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { AppointmentsTable } from 'src/sections/doctor/appointments/appointments-table';
import { applyPagination } from 'src/utils/apply-pagination';
import { useRouter } from 'next/navigation';
import { AppointmentsFilter } from 'src/sections/doctor/appointments/appointments-filter';

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

  const doctorUsername = new URLSearchParams(window.location.search).get('doctorUsername');

  const [data, setData] = useState([]);
  const [allData , setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(data, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const router = useRouter();


  useEffect(() => {
    fetch('http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername='+doctorUsername)
      .then((res) => {
        if(res.statusCode == 401)
           throw new Error('Error while fetching data'); 
        return res.json();
      })
      .then((data) => {

        const appointments = data.appointments;

        appointments.sort((a, b) => {
          if(new Date(a.date) < new Date(b.date))
              return -1;
          if(new Date(a.date) > new Date(b.date))
              return 1;
          if(a.startHour < b.startHour)
              return -1;
          if(a.startHour > b.startHour)
              return 1;
          return 0;
        });

        setAllData(appointments);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [filter1, setFilter1] = useState('');
  const [filter2, setFilter2] = useState('');

  useEffect(() => {
    const filtered = allData.filter((appointment) => {
      if(filter1 === '' && filter2 === '')
        return true;
      if(filter1 !== '' && filter2 !== '')
        return appointment.date >= filter1 && appointment.date <= filter2;
      if(filter1 !== '')
        return appointment.date >= filter1;
      if(filter2 !== '')
        return appointment.date <= filter2;
    });
    setData(filtered);
  }, [filter1, filter2, allData]);

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
                </Stack>
              </Stack>
            </Stack>
            <AppointmentsFilter setState1={setFilter1} setState2={setFilter2} />
            { <AppointmentsTable
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
