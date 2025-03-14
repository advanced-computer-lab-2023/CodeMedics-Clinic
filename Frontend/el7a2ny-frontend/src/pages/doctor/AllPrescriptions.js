import { useState } from "react";
import { TableRow } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Cookies from "js-cookie";
import { Table } from "src/components/Table/Table";
import ObjectInfo from "src/components/ObjectInfo";
import DoctorPrescriptionActions from "src/components/Prescription/DoctorPrescriptionActions";
import Message from "src/components/Miscellaneous/Message";

const columns = ["Patient", "Date", "Status", "Actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.date);

      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (patientName && !item.patientUsername.includes(patientName)) return false;

      return true;
    });
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${username}/prescriptions`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const filters = [
    {
      type: "text",
      name: "Search Patient Name",
      setState: setPatientName,
    },
    {
      type: "date",
      name: "Start Date",
      setState: setStartDate,
    },
    {
      type: "date",
      name: "End Date",
      setState: setEndDate,
    },
  ];

  const tableRows = data.map((item) => {
    return (
      <TableRow>
        <ObjectInfo obj={item} attributes={["patientUsername", "date", "filled"]} />
        <DoctorPrescriptionActions item={item} />
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
          noRecords: "No Prescriptions Found",
          setAllData,
          tableRows,
          popUpDisplay,
          setPopUpDisplay,
          popUpElement,
          setPopUpElement,
        }}
        title="Prescriptions"
        filters={filters}
      />
      <Message
        condition={showError}
        setCondition={setShowError}
        title="Error"
        message={error}
        action="Close"
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
