import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import Cookies from "js-cookie";
import Message from "src/components/Miscellaneous/Message";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { Table } from "src/components/Table/Table";
import { DELETE } from "src/project-utils/helper-functions";
import FollowUpRow from "src/components/Appointment/FollowUpRow";

const columns = ["Patient", "Date", "From", "To", "Actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${username}/appointments?status=follow-up Requested`,
    setData: setAllData,
    setLoading: setLoading,
    setShowError,
    setError,
  });

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.date);

      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (patientName && !item.patientUsername.includes(patientName)) return false;

      return true;
    });
  }

  function reject(appointment) {
    DELETE({
      url: `${BACKEND_ROUTE}/doctors/appointments/${appointment._id}`,
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) => prev.filter((item) => item._id != appointment._id));
      },
    });
  }

  const data = filterData();

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
    return <FollowUpRow item={item} reject={reject} />;
  });

  console.log("data", data);

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
          noRecords: "No Follow-up Requests Found",
          setAllData,
          tableRows,
          popUpDisplay,
          setPopUpDisplay,
          popUpElement,
          setPopUpElement,
          reject
        }}
        filters={filters}
        title="Follow-up Requests"
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
