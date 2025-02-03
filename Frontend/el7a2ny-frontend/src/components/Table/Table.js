import { useContext } from "react";
import {Box, Container, Stack} from "@mui/material"
import Title from "./Body/Title";
import Header from "./Body/Header";
import Filters from "../Filters/Filters";
import { TableContext } from "../Themes/PatientPrescriptionsTheme";
import Content from "./Body/Content";
import NoRecords from "../NoRecords";
import LoadingSpinner from "../Miscellaneous/LoadingSpinner";

function Table() {
  console.log("table rendered")
  const { title, filters, data, noRecords, loading } = useContext(TableContext);
  
  return (
    <>
      <Title title={title} />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Header name={title} />
            <Filters filters={filters} />
            {loading ? <LoadingSpinner/> : data.length == 0 ? <NoRecords message={noRecords}/> : <Content />}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Table;
