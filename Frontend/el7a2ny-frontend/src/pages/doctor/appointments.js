import { useState } from "react";
import { Box, Button, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import axios from "axios";
import Cookies from "js-cookie";
import Title from "src/components/Table/Body/Title";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Appointment from "src/components/Appointment/Appointment";
import Icon from "src/components/Icon";
import { PATCH } from "src/project-utils/helper-functions";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Table } from "src/components/Table/Table";

const now = new Date();

const columns = ["patient", "date", "from", "to", "status", "actions"];
const attributes = ["patientUsername", "date", "startHour", "endHour", "status"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [status, setStatus] = useState("None");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("17:00");

  const appointments = filterData();

  const filters = [
    {
      type: "text",
      name: "Search Doctor Name",
      state: doctorName,
      setState: setDoctorName,
    },
    {
      type: "menu",
      name: "Status",
      state: status,
      setState: setStatus,
      options: [
        { value: "None", label: "None" },
        { value: "unreserved", label: "Unreserved" },
        { value: "upcoming", label: "Upcoming" },
        { value: "rescheduled", label: "Rescheduled" },
        { value: "cancelled", label: "Cancelled" },
        { value: "completed", label: "Completed" },
      ],
    },
  ];

  const username = Cookies.get("username");

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${username}/appointments`,
    setData: setAllData,
    setLoading,
    setError,
    setShowError,
  });

  function filterData() {
    return allData.filter((item) => {
      if (item.status === "follow-up Requested") return false;
      if (status !== "None" && item.status !== status) return false;
      if (doctorName !== "" && !`${item.firstName} ${item.lastName}`.includes(doctorName))
        return false;

      return true;
    });
  }

  function updateAppointment(appointmentId, status) {
    PATCH({
      url: `${BACKEND_ROUTE}/doctors/appointments/${appointmentId}`,
      body: { status },
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id == appointmentId) {
              return { ...item, status: "cancelled" };
            }
            return item;
          })
        );
      },
      setShowError,
      setError,
    });
  }

  const actions = appointments.map((item) => (
    <>
      <Icon
        disabled={!(item.status == "upcoming" || item.status == "rescheduled")}
        title="Complete Appointment"
        onClick={() => {
          updateAppointment(item._id, "completed");
        }}
      >
        <CheckIcon />
      </Icon>
      <Icon
        disabled={!(item.status == "upcoming" || item.status == "rescheduled")}
        title="Cancel Appointment"
        onClick={() => {
          updateAppointment(item._id, "cancelled");
        }}
      >
        <CancelIcon />
      </Icon>
    </>
  ));

  const tableRows = appointments.map((item, index) => {
    return <Appointment actions={actions[index]} appointment={item} attributes={attributes} />;
  });

  function addAppointment() {}

  const tableActions = (
    <Button
      startIcon={
        <SvgIcon fontSize="small">
          <PlusIcon />
        </SvgIcon>
      }
      variant="contained"
      onClick={() => {
        addAppointment();
      }}
    >
      Add Appointment
    </Button>
  );

  return (
    <Table
      value={{
        data: appointments,
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
      actions={tableActions}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
