import Message from "../components/Miscellaneous/Message";
import { useEffect, useState } from "react";
import axios from "axios";
import {Table} from "../components/Table/Table";


function PatientPrescriptionsTheme() {
  const [allData, setAllData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);

  const [doctorName, setDoctorName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("None");
  
  const dataRoute = "http://localhost:8000/patient/prescriptions";
  console.log("theme rendered")
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

  const columns = ["Doctor", "Date", "Status", "Actions"];

  function sortByDate(prescriptions) {
    prescriptions.sort((a, b) => {
      if (new Date(a.Date) < new Date(b.Date)) return -1;
      if (new Date(a.Date) > new Date(b.Date)) return 1;
      return 0;
    });
    return prescriptions;
  }

  function filterData() {
    console.log("in the filterData");
    const newData = allData.filter((item) => {
      const itemDate = new Date(item.Date);
      console.log(new Date(startDate), new Date(endDate), itemDate, item.Date)
      console.log(item)
      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      const doctorCondition =
        !doctorName || item.Doctor.toLowerCase().includes(doctorName.toLowerCase());
      console.log(doctorName, item.Doctor);
      const itemStatus = item.filled? "filled" : "unfilled"
      if (!doctorCondition) return false;
      
      if (status !== "None" && itemStatus !== status) return false;

      return true;
    });
    console.log("newData", newData);
    console.log("All data", allData)
    setData(newData);
    setLoading(false)
  }

  useEffect(() => {
    axios
      .get(dataRoute, { withCredentials: true })
      .then((res) => {
        const prescriptions = sortByDate(res.data);
        setAllData(prescriptions);
        setData(prescriptions);
        setLoading(false);
        console.log("data is passed ", prescriptions);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setError(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    if(allData && allData.length)
        filterData();
  }, [startDate, endDate, status, doctorName, allData]);

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
        elementType: "patientPrescription",
        title: "Prescriptions",
        setShowError,
        setError,
        setLoading,
        setAllData,
        noRecords: "No Prescriptions Found",
      }}
      />
  );
}

export { PatientPrescriptionsTheme };
