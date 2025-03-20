import { useState } from "react";
import { TableCell, TableRow } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import Message from "src/components/Miscellaneous/Message";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/utils/Constants";
import { Table } from "src/components/Table/Table";
import ObjectInfo from "src/components/ObjectInfo";
import ButtonElement from "src/components/ButtonElement";
import { DELETE } from "src/utils/helper-functions";

const columns = [
  "name",
  "username",
  "email",
  "hourly rate",
  "affiliation",
  "date of birth",
  "degree",
  "actions",
];

const Page = () => {
  const [allData, setAllData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filters = [
    { type: "text", name: "Search Doctor Name", state: searchName, setState: setSearchName },
    {
      type: "date",
      name: "Born After Date",
      setState: setStartDate,
    },
    {
      type: "date",
      name: "Born Before Date",
      setState: setEndDate,
    },
  ];

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.dateOfBirth);
      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (searchName != "" && !`${item.firstName} ${item.lastName}`.includes(searchName)) {
        return false;
      }

      return true;
    });
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/admins/doctors`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const handleRemove = async (doctorUsername) => {
    DELETE({
      url: `${BACKEND_ROUTE}/admins/doctors/${doctorUsername}`,
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
        <ObjectInfo
          obj={item}
          attributes={[
            "name",
            "username",
            "email",
            "hourlyRate",
            "affiliation",
            "dateOfBirth",
            "degree",
          ]}
        />
        <TableCell>
          <ButtonElement
            actionName="Remove"
            onClick={() => {
              console.log("removing", item, item.username);
              const doctorUsername = item.username;
              handleRemove(doctorUsername);
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
          noRecords: "No Doctors Found",
          allData,
          setAllData,
          tableRows,
        }}
        title="Doctors"
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
