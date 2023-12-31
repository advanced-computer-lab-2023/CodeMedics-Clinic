import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, TextField } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/doctor/layout';
import { PatientsTable } from 'src/sections/doctor/myPatients/patients-table';
import { CustomersSearch } from 'src/sections/doctor/myPatients/patients-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { set } from 'nprogress';
import { bool } from 'prop-types';
import LoadingSpinner from 'src/components/LoadingSpinner';
import NoRecords from 'src/components/NoRecords';
import Message from 'src/components/Message';
const now = new Date();

const useMedicines = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useMedicineIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useMedicines(data, page, rowsPerPage);
  const customersIds = useMedicineIds(customers);
  const customersSelection = useSelection(customersIds);
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    axios({
      method: 'GET',
      url: 'http://localhost:8000/doctor/viewPatients',
      withCredentials: true,
    })
      .then((data) => {
        if (data.data.patients.length > 0) {
          setData(data.data.patients);
          setAllData(data.data.patients);
          setSearchData(data.data.patients);
          setFilteredData(data.data.patients);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    handleData();
  }, [searchData, filteredData]);


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

  const handleData = () => {
    setData(allData.filter((medicine) => filteredData.includes(medicine) && searchData.includes(medicine)));
  }

  const handleSearch = (str) => {
    if (str === "") {
      setSearchData(allData);
    }
    else {
      setSearchData(allData.filter((patient) => {
        const name = patient.FirstName + " " + patient.LastName;
        return name.toLowerCase().includes(str.toLowerCase());
      }));
    }
  }

  const handleFilter = (str) => {
    if (str === "None") {
      setFilteredData(allData);
    }
    else {
      if(str == "Yes"){
        setFilteredData(allData.filter((patient) => patient.upcoming == true));
      }
      else{
        setFilteredData(allData.filter((patient) => patient.upcoming == false));
      }
    }
  }

  return (
    <>
      <Head>
        <title>
          Patients
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
                  Patients
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>

            </Stack>
            {loading ? <LoadingSpinner /> : (
              <>
              <CustomersSearch data={data} handleSearch={handleSearch} handleFilter={handleFilter} />
              {data.length == 0 ? <NoRecords message={"No Patients Found"} /> : (
                <PatientsTable
                count={data.length}
                items={customers}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
              />
              )}
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
