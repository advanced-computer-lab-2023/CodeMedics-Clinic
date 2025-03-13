import { useState } from "react";
import { Button, Stack, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import Cookies from "js-cookie";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Appointment from "src/components/Appointment/Appointment";
import Icon from "src/components/Icon";
import { PATCH, POST } from "src/project-utils/helper-functions";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Table } from "src/components/Table/Table";
import PopUp from "src/components/Miscellaneous/PopUp";
import ButtonElement from "src/components/ButtonElement";
import TextInput from "src/components/Inputs/TextInput";

const now = new Date();

const columns = ["patient", "date", "from", "to", "status", "actions"];
const attributes = ["patientUsername", "date", "startHour", "endHour", "status"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("None");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [displayPopUp, setDisplayPopUp] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("17:00");

  const patientUsername = new URLSearchParams(window.location.search).get("patientUsername");

  const appointments = filterData();

  const filters = [
    {
      type: "text",
      name: "Search Patient Name",
      state: patientName,
      setState: setPatientName,
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
      if (status !== "None" && item.status !== status) return false;
      if (patientUsername && item.patientUsername != patientUsername) return false;
      if (patientName !== "" && !`${item.patientUsername}`.includes(patientName)) return false;
      if (item.status === "follow-up Requested") return false;

      return true;
    });
  }

  function updateAppointment(appointmentId, status) {
    PATCH({
      url: `${BACKEND_ROUTE}/doctors/appointments/${appointmentId}/${
        status == "cancelled" ? "cancel" : "complete"
      }`,
      body: { status },
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id == appointmentId) {
              return { ...item, status: status };
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
        <CancelIcon disabled={!(item.status == "upcoming" || item.status == "rescheduled")} />
      </Icon>
    </>
  ));

  const tableRows = appointments.map((item, index) => {
    return <Appointment actions={actions[index]} appointment={item} attributes={attributes} />;
  });

  function addAppointment(selectedDate, endHour, startHour) {
    POST({
      url: `${BACKEND_ROUTE}/doctors/${username}/appointments`,
      body: { date: selectedDate, endHour, startHour },
      updater: () => {
        window.location.reload();
      },
      setShowError,
      setError,
    });
  }

  const tableActions = (
    <Button
      startIcon={
        <SvgIcon fontSize="small">
          <PlusIcon />
        </SvgIcon>
      }
      variant="contained"
      onClick={() => {
        setDisplayPopUp(true);
      }}
    >
      Add Appointment
    </Button>
  );

  return (
    <>
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
      <PopUp
        title="Add Appointment"
        viewing={displayPopUp}
        setViewing={setDisplayPopUp}
        actions={
          <>
            <ButtonElement
              actionName="Cancel"
              onClick={() => {
                setDisplayPopUp(false);
              }}
            />
            <ButtonElement
              actionName="Add"
              onClick={() => {
                addAppointment(selectedDate, startHour, endHour);
              }}
            />
          </>
        }
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <TextInput
            type="Date"
            option="Date"
            defaultValue={selectedDate ? selectedDate : new Date()}
            setValue={setSelectedDate}
          />
          <TextInput
            type="time"
            option="Start Hour"
            defaultValue={startHour}
            setValue={setStartHour}
          />
          <TextInput type="time" option="End Hour" defaultValue={endHour} setValue={setEndHour} />
        </Stack>
      </PopUp>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
