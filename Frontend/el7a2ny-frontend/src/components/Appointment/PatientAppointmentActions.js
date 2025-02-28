import { useContext, useEffect, useState } from "react";
import { Table, TableBody } from "@mui/material";
import ChecklistIcon from "src/icons/untitled-ui/duocolor/ChecklistIcon";
import RescheduleIcon from "src/icons/untitled-ui/duocolor/RescheduleIcon";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { TableContext } from "../Table/Table";
import LoadingSpinner from "../LoadingSpinner";
import PopUp from "../Miscellaneous/PopUp";
import Head from "../Table/Body/Head";
import ButtonElement from "../ButtonElement";
import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";
import Icon from "../Icon";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";
import { PATCH } from "src/project-utils/helper-functions";
import AppointmentInfo from "./AppointmentInfo";
const attributes = ["date", "day", "startHour", "endHour"];

function PatientAppointmentActions({ appointment }) {
  const { setShowError, setError, setAllData, setPopUpDisplay, setPopUpElement } =
    useContext(TableContext);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const unreservedAppointmentsElements = unreservedAppointments.map((item) => {
    return (
      <Row key={item._id}>
        <AppointmentInfo appointment={item} attributes={attributes} />
        <Cell>
          <ButtonElement
            actionName="Reschedule"
            onClick={() => {
              hanldeRescheduleAppointment(item, appointment);
              setRescheduling(false);
              setPopUpDisplay(false);
            }}
          />
        </Cell>
      </Row>
    );
  });

  const reschedulePopUp = (
    <PopUp
      title={"Reschedule Appointment"}
      viewing={rescheduling}
      setViewing={setRescheduling}
      actionName="Close"
      setPopUpDisplay={setPopUpDisplay}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table>
          {unreservedAppointments.length ? (
            <>
              <Head columns={["Date", "Day", "From", "To"]} />
              <TableBody>{unreservedAppointmentsElements}</TableBody>
            </>
          ) : (
            <Row>
              <Cell>Sorry, No Available Slots!</Cell>
            </Row>
          )}
        </Table>
      )}
    </PopUp>
  );

  async function handleRequestFollowUp(appointmentId) {
    PATCH({
      url: `${BACKEND_ROUTE}/patients/appointments/${appointmentId}`,
      body: { status: "follow-up Requested" },
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== appointmentId) return item;
            return { ...item, status: "follow-up Requested" };
          })
        );
      },
    });
  }

  async function hanldeRescheduleAppointment(newApp, oldApp) {
    PATCH({
      url: `${BACKEND_ROUTE}/patients/appointments/${newApp._id}`,
      body: { status: "rescheduled", patientUsername: oldApp.patientUsername },
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== oldApp._id) return item;
            return {
              ...item,
              _id: newApp._id,
              status: "rescheduled",
              patientUsername: oldApp.patientUsername,
            };
          })
        );
      },
    });

    PATCH({
      url: `${BACKEND_ROUTE}/patients/appointments/${oldApp._id}`,
      body: { status: "unresrved", patientUsername: null },
      setShowError,
      setError,
    });
  }

  async function handleCancelAppointment(appointmentId) {
    PATCH({
      url: `${BACKEND_ROUTE}/patients/appointments/${appointmentId}/cancel`,
      setLoading,
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== appointmentId) return item;
            return { ...item, status: "cancelled" };
          })
        );
      },
    });
  }

  useEffect(() => {
    if (rescheduling) {
      setPopUpDisplay(true);
      setPopUpElement(reschedulePopUp);
    }
  }, [rescheduling, loading]);

  useGet({
    url: `${BACKEND_ROUTE}/patients/doctors/${appointment.doctorUsername}/appointments?status=unreserved`,
    setData: setUnreservedAppointments,
    setLoading: setLoading,
    setShowError,
    setError,
    dependency: [appointment.doctorUsername],
  });

  return (
    <>
      <Icon
        title="Request Follow-up"
        disabled={!(appointment.status == "completed")}
        onClick={() => {
          handleRequestFollowUp(appointment._id);
        }}
      >
        <ChecklistIcon />
      </Icon>
      <Icon
        disabled={!(appointment.status === "upcoming" || appointment.status === "rescheduled")}
        title="Reschedule Appointment"
        onClick={() => {
          setRescheduling(true);
        }}
      >
        <RescheduleIcon />
      </Icon>
      <Icon
        title="Cancel Appointment"
        onClick={() => {
          handleCancelAppointment(appointment._id);
        }}
      >
        <CancelIcon />
      </Icon>
    </>
  );
}

export default PatientAppointmentActions;
