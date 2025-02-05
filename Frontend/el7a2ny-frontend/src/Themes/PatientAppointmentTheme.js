import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Message from "src/components/Miscellaneous/Message";
import { Table } from "src/components/Table/Table";
import { patientAppointmentRoute, familyMembersRoute } from "src/project-utils/Constants";
import { sortByDate } from "src/project-utils/HelperFunctions";


const columns = ["Doctor", "Date", "Day", "From", "To", "Status", "Actions"];

function PatientAppointmentTheme() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("None");
  const [currentPatient, setCurrentPatient] = useState(Cookies.get("username"));
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);

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
          value: item.familyMember.Username,
          label: item.familyMember.FirstName + " " + item.familyMember.LastName,
        };
      }),
    },
  ];

  function filterData() {
    const newData = allData.filter((item) => {
      const itemDate = new Date(item.date);
      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (status !== "None" && item.status !== status) return false;

      if (item.patient != currentPatient) return false;

      return true;
    });
    setData(newData);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(patientAppointmentRoute, { withCredentials: true })
      .then((res) => {
        const appointments = sortByDate(res.data.appointments);
        setAllData(appointments);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get(familyMembersRoute, { withCredentials: true })
      .then((res) => {
        let temp = [];
        temp.push({
          familyMember: { Username: Cookies.get("username"), FirstName: "me", LastName: "" },
          relation: "me",
        });
        for (let i = 0; i < res.data.familyMembers.length; i++) {
          temp.push(res.data.familyMembers[i]);
        }
        setFamilyMembers(temp);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (allData && allData.length) filterData(allData);
  }, [startDate, endDate, status, currentPatient, allData]);

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
        filters,
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
        title: "Appointments",
        elementType: "patientAppointment",
        noRecords: "No Appointments Found",
        setAllData,
      }}
    />
  );
}

export default PatientAppointmentTheme;
