import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { Table } from "src/components/Table/Table";
import { useGet } from "src/hooks/custom-hooks";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import PatientAppointment from "src/components/Appointment/PatientAppointment";
import Icon from "src/components/Icon";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
const columns = ["date", "day", "from", "to", "price", "actions"];
const attributes = ["date", "day", "startHour", "endHour", "price"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const username = Cookies.get("username");
  const doctorUsername = new URLSearchParams(window.location.search).get("doctorUsername");
  const data = filterData();
  const tableRows = data.map((item) => {
    return (
      <PatientAppointment
        appointment={item}
        attributes={attributes}
        actions={
          <Icon
            title="Book Appointment"
            onClick={() => {
              router.push(`/patient/payment?patientUsername=${username}&appointmentId=${item._id}`);
            }}
          >
            <CheckIcon />
          </Icon>
        }
      />
    );
  });

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
  ];

  useGet({
    url: `http://localhost:8000/patients/doctors/${doctorUsername}/appointments?status=unreserved`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  function filterData() {
    return allData.filter((appointment) => {
      if (startDate === "" && endDate === "") return true;
      if (startDate !== "" && endDate !== "")
        return appointment.date >= startDate && appointment.date <= endDate;
      if (startDate !== "") return appointment.date >= startDate;
      if (endDate !== "") return appointment.date <= endDate;
    });
  }

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
          noRecords: "No Appointments Found",
          setAllData,
          tableRows,
        }}
        title="Appointments"
        filters={filters}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
