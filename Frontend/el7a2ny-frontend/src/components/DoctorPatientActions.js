import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicationIcon from "@mui/icons-material/Medication";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Icon from "./Icon";
import { useRouter } from "next/router";
import ReschedulePopUp from "./ReschedulePopUp";
import Cookies from "js-cookie";
import { useState } from "react";
import { BACKEND_ROUTE } from "src/utils/Constants";
export const DoctorPatientActions = ({ patient }) => {
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const router = useRouter();

  const username = Cookies.get("username");

  function handleViewAppointments() {
    router.push(`/doctor/appointments?patientUsername=${patient.username}`);
  }

  function handleViewPrescriptions() {
    router.push(`/doctor/prescriptions?patientUsername=${patient.username}`);
  }

  function handleViewRecords() {
    router.push(`/doctor/medical-history?patientUsername=${patient.username}`);
  }

  return (
    <>
      <Icon title="View Appointments" onClick={handleViewAppointments}>
        <EventNoteIcon />
      </Icon>
      <Icon title="View Prescriptions" onClick={handleViewPrescriptions}>
        <MedicationIcon />
      </Icon>
      <Icon title="View Health Records" onClick={handleViewRecords}>
        <AssignmentIcon />
      </Icon>
      <Icon
        title="Schedule a Follow-Up"
        onClick={() => {
          setRescheduling(true);
        }}
      >
        <EventAvailableIcon />
      </Icon>
      <ReschedulePopUp
        rescheduling={rescheduling}
        setRescheduling={setRescheduling}
        patient={patient}
        scheduleFollowUp={true}
        getUrl={`${BACKEND_ROUTE}/doctors/${username}/appointments`}
        patchUrl={`${BACKEND_ROUTE}/doctors/${username}/appointments`}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};
