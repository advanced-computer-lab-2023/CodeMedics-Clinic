import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import Message from "src/components/Miscellaneous/Message";
import { useState } from "react";
import { Table } from "src/components/Table/Table";
import { BACKEND_ROUTE } from "src/utils/Constants";
import PatientPrescription from "src/components/Prescription/PatientPrescription";
import { useGet } from "src/hooks/custom-hooks";
import Cookies from "js-cookie";
const columns = ["Doctor", "Date", "Status", "Actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("None");

  const username = Cookies.get("username");

  const filters = [
    {
      type: "text",
      name: "Doctor Name",
      state: doctorName,
      setState: setDoctorName,
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
    {
      type: "menu",
      name: "Filled",
      state: status,
      setState: setStatus,
      options: [
        { value: "None", label: "None" },
        { value: "filled", label: "Filled" },
        { value: "unfilled", label: "Unfilled" },
      ],
    },
  ];

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.Date);
      console.log(new Date(startDate), new Date(endDate), itemDate, item.Date);
      console.log(item);
      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      const doctorCondition =
        !doctorName || item.Doctor.toLowerCase().includes(doctorName.toLowerCase());
      console.log(doctorName, item.Doctor);
      const itemStatus = item.filled ? "filled" : "unfilled";
      if (!doctorCondition) return false;

      if (status !== "None" && itemStatus !== status) return false;

      return true;
    });
  }

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/prescriptions`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const data = filterData();

  const tableRows = data.map((prescription) => <PatientPrescription prescription={prescription} />);

  console.log("data", data);
  console.log("all data", allData);

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
          setAllData,
          noRecords: "No Prescriptions Found",
          tableRows,
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
