import { useState } from "react";
import { Button, Stack, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import Cookies from "js-cookie";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/utils/Constants";
import Appointment from "src/components/Appointment/Appointment";
import { POST } from "src/utils/helper-functions";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Table } from "src/components/Table/Table";
import PopUp from "src/components/Miscellaneous/PopUp";
import ButtonElement from "src/components/ButtonElement";
import TextInput from "src/components/Inputs/TextInput";
import Message from "src/components/Miscellaneous/Message";
import DoctorAppointmentActions from "src/components/Appointment/DoctorAppointmentActions";

const columns = ["patient", "date", "from", "to", "status", "actions"];
const attributes = ["patientUsername", "date", "startHour", "endHour", "status"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("None");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);

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

  const tableRows = appointments.map((item) => {
    return (
      <>
        <Appointment
          actions={<DoctorAppointmentActions item={item} />}
          appointment={item}
          attributes={attributes}
        />
      </>
    );
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
          allData,
          setAllData,
          tableRows,
          popUpDisplay,
          setPopUpDisplay,
          popUpElement,
          setPopUpElement,
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
