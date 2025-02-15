import { Layout as DashboardLayout } from 'src/layouts/dashboard/user/layout';
import { useState } from "react";
import Cookies from "js-cookie";
import Message from "src/components/Miscellaneous/Message";
import { Table } from "src/components/Table/Table";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import PatientAppointment from "src/components/Appointment/PatientAppointment";
import { useGet } from "src/hooks/custom-hooks";
import PatientAppointmentActions from "src/components/Appointment/PatientAppointmentActions";

const columns = ["doctor", "date", "day", "from", "to", "status", "actions"];
const attributes = ["doctorUsername", "date", "day", "startHour", "endHour", "status"];
const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [familyMembersData, setFamilyMembersData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("None");
  const [currentPatient, setCurrentPatient] = useState(Cookies.get("username"));
  const [chosenDoctorUsername, setChosenDoctorUsername] = useState('');
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);

  const doctorUsername = new URLSearchParams(window.location.search).get("doctorUsername");

  const data = filterData();

  const familyMembers = [{ username: Cookies.get("username"), firstName: "me", lastName: "" }];
  for (let i = 0; i < familyMembersData.length; i++) {
    familyMembers.push(familyMembersData[i]);
  }
  const tableRows = data.map((appointment) => {
    return (
      <PatientAppointment
        appointment={appointment}
        attributes={attributes}
        actions={<PatientAppointmentActions appointment={appointment} />}
      />
    );
  });

  console.log("tableRows", allData, data);
  console.log("username", Cookies.get("username"));
  const filters = [
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
      name: "Status",
      state: status,
      setState: setStatus,
      options: [
        { value: "None", label: "None" },
        { value: "upcoming", label: "Upcoming" },
        { value: "rescheduled", label: "Rescheduled" },
        { value: "cancelled", label: "Cancelled" },
        { value: "completed", label: "Completed" },
        { value: "follow-up Requested", label: "Follow-up Requested" },
      ],
    },
    {
      type: "menu",
      name: "Patient",
      state: currentPatient,
      setState: setCurrentPatient,
      options: familyMembers.map((item) => {
        return {
          value: item.username,
          label: item.firstName + " " + item.lastName,
        };
      }),
    },
  ];

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.date);

      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (status !== "None" && item.status !== status) return false;

      if (item.patientUsername != currentPatient) return false;

      if (doctorUsername && item.doctorUsername != doctorUsername) return false;

      return true;
    });
  }

  useGet({
    url: `${BACKEND_ROUTE}/patients/${Cookies.get("username")}/appointments`,
    setData: setAllData,
    setShowError,
    setError,
  });

  useGet({
    url: `${BACKEND_ROUTE}/patients/${Cookies.get("username")}/family-members`,
    setData: setFamilyMembersData,
    setLoading,
    setShowError,
    setError,
  });

  if (showError) {
    return (
      <Message
        condition={showError}
        setCondition={setShowError}
        title="Error"
        message={error}
        action="Close"
      />
    );
  }

  return (
    <Table
      value={{
        data,
        columns,
        loading,
        setShowError,
        setError,
        setLoading,
        popUpDisplay,
        popUpElement,
        setPopUpDisplay,
        setPopUpElement,
        currentPatient,
        noRecords: "No Appointments Found",
        setAllData,
        tableRows,
      }}
      title="Appointments"
      filters={filters}
    />
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
