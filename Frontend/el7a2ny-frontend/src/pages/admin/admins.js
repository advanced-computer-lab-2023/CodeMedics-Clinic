import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography , Alert } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/admin/layout';
import { AdminsTable } from 'src/sections/admin/Admins/AdminsTable';
import { AdminsSearch } from 'src/sections/admin/Admins/AdminsSearch';
import { applyPagination } from 'src/utils/apply-pagination';
import Cookies from 'js-cookie';

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
  const [alert , setAlert] = useState(false);
  const [alertMessage , setAlertMessage] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/admin/viewAdmins')
      .then((res) => {
        if (res.status == 401) {
          throw new Error('Error while fetching data');
        }
        return res.json();
      })
      .then((data) => {
        if (data['admins']) {
          console.log(data['admins']);
        setData(data['admins']);
        }
  })
    .catch((err) => {});
}, []);

const handleRemove = (username)  => {
//   console.log(Cookies.username);
  axios('http://localhost:8000/admin/removeAdmin', {
            method: 'POST',
            data: { username },
            withCredentials: true
        })
  .then((res) => {
    console.log(res);
    if(res.status == 200) {
      console.log("removed");
      window.location.reload();
    }
  })
  .catch((err) => {
    setAlert(true);
    setAlertMessage(err.response.data.message);
  }
  )
}

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
        Admins
      </title>
    </Head>
    {alert && 
      <Stack sx={{width: 600 , ml: 35}} spacing={20}>
        <></>
        <Alert onClose={() => {setAlert(false);}} severity="warning" style={{ backgroundColor: '#fff4e5',  }}>{alertMessage}</Alert>
      </Stack>
    }
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
                Admins
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
          <AdminsSearch/>
          <AdminsTable
            handleRemove = {handleRemove}
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
