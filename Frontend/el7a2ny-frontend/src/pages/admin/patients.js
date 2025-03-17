import { useState } from "react";
import { Box, Container, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import { PatientTable } from "src/sections/admin/Patients/Patient-Table";
import { PatientsSearch } from "src/sections/admin/Patients/patients-search";
import Message from "src/components/Miscellaneous/Message";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { Table } from "src/components/Table/Table";
import { Row } from "src/sections/admin/Patients/Patient-row";
import ObjectInfo from "src/components/ObjectInfo";
import ButtonElement from "src/components/ButtonElement";

const columns = ["name", "username", "email", "gender", "phone", "actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");

  const filters = [
    { type: "text", name: "Search Admin Name", state: searchName, setState: setSearchName },
  ];

  function filterData() {
    return allData.filter((item) => `${item.firstName} ${item.lastName}`.includes(searchName));
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/admins/patients`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const handleRemove = async (patientUsername) => {
    DELETE({
      url: `${BACKEND_ROUTE}/admins/patients/${patientUsername}`,
      setShowError,
      setError,
      updater: () => {
        window.location.reload();
      },
    });
  };

  const tableRows = data.map((item) => {
    return (
      <TableRow>
        <ObjectInfo obj={item} attributes={["name", "username", "email", "gender", "number"]} />
        <TableCell>
          <ButtonElement
            actionName="Remove"
            onClick={() => {
              console.log("removing", item, item.username);
              const patientUsername = item.username;
              handleRemove(patientUsername);
            }}
          />
        </TableCell>
      </TableRow>
    );
  });

  return (
    <>
      <Table
        value={{
          data,
          columns,
          loading,
          setShowError,
          setError,
          setLoading,
          noRecords: "No Patients Found",
          allData,
          setAllData,
          tableRows,
        }}
        title="Patients"
        filters={filters}
      />
      <Message
        title="Error"
        message={error}
        condition={showError}
        setCondition={setShowError}
        buttonAction={"Close"}
      />
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
