import { useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import { RequestTable } from "src/sections/admin/Requests/Request-Table";
import { RequestSearch } from "src/sections/admin/Requests/Request-search";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { Table } from "src/components/Table/Table";
import Message from "src/components/Miscellaneous/Message";
import ObjectInfo from "src/components/ObjectInfo";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import Icon from "src/components/Icon";
import { PATCH } from "src/project-utils/helper-functions";

const columns = [
  "name",
  "username",
  "email",
  "hourlyRate",
  "affiliation",
  "edu",
  "documents",
  "actions",
];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");

  const filters = [
    { type: "text", name: "Search Admin Username", state: searchName, setState: setSearchName },
  ];

  function filterData() {
    return allData.filter((item) => `${item.firstName} ${item.lastName}`.includes(searchName));
  }

  function updateDoctor(doctorUsername, action) {
    PATCH({
      url: `${BACKEND_ROUTE}/admins/doctors/${doctorUsername}/${action}`,
      setShowError,
      setError,
      updater: () => {
        window.location.reload();
      }
    })
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/admins/doctors/applications`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const tableRows = data.map((item) => {
    return (
      <TableRow>
        <ObjectInfo
          obj={item}
          attributes={[
            "name",
            "username",
            "email",
            "hourlyRate",
            "affiliation",
            "degree",
            "documents",
          ]}
        />
        <TableCell>
          <Icon title="Accept Doctor" onClick={() => updateDoctor(item.username, "accept")}>
            <CheckIcon />
          </Icon>
          <Icon title="Reject Doctor" onClick={() => updateDoctor(item.username, "reject")}>
            <XMarkIcon />
          </Icon>
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
          noRecords: "No Applications Found",
          allData,
          setAllData,
          tableRows,
        }}
        title="Doctors Applications"
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
