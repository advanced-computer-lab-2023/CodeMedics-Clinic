import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody } from "@mui/material";
import ChecklistIcon from "src/icons/untitled-ui/duocolor/ChecklistIcon";
import RescheduleIcon from "src/icons/untitled-ui/duocolor/RescheduleIcon";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { TableContext } from "../Table/Table";
import LoadingSpinner from "../LoadingSpinner";
import PopUp from "../Miscellaneous/PopUp";
import Head from "../Table/Body/Head";
import PatientAppointmentInfo from "./PatientAppointmentInfo";
import Button from "../Button";
import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";
import Icon from "../Icon";
import { freeSlotsRoute, followUpRequestRoute, appointmentRescheduleRoute, appointmentCancellationRoute } from "src/project-utils/Constants";

function PatientAppointmentActions({ appointment }) {
  const { setShowError, setError, setAllData, currentPatient, setPopUpDisplay, setPopUpElement } =
    useContext(TableContext);
  const [loading, setLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);

  const unreservedAppointmentsElements = unreservedAppointments.map((item) => {
    return (
      <Row key={item._id}>
        <PatientAppointmentInfo appointment={item} />
        <Cell>
          <Button actionName="Reschedule"onClick={() => {
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

  const getUnreservedAppointments = async (doctorUsername) => {
    setLoading(true);
    await axios
      .get(`${freeSlotsRoute}?doctorUsername=${doctorUsername}`)
      .then((res) => {
        console.log(doctorUsername, "unreserved slots", res.data.appointments);
        setUnreservedAppointments(res.data.appointments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setError(err.response.data.message);
      });
  };

  const handleRequestFollowUp = async (appointmentID) => {
    await axios
      .patch(`${followUpRequestRoute}?appointmentID=${appointmentID}`)
      .then((res) => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== appointmentID) return item;
            return { ...item, status: "follow-up Requested" };
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setError(err.response.data.message);
      });
  };

  const hanldeRescheduleAppointment = async (curAppointment, oldAppointment) => {
    await axios
      .patch(
        `${appointmentRescheduleRoute}?appointmentID=${curAppointment._id}&oldAppointmentID=${oldAppointment._id}&username=${currentPatient}`
      )
      .then((res) => {
        console.log("LLL", res);
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== oldAppointment._id) return item;
            return res.data.appointment;
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setError(err.response.data.message);
      });
  };

  const handleCancelAppointment = async (appointmentID) => {
    await axios
      .patch(`${appointmentCancellationRoute}?appointmentID=${appointmentID}`)
      .then((res) => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id !== appointmentID) return item;
            return { ...item, status: "cancelled" };
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setError(err.response.data.message);
      });
  };

  useEffect(() => {
    if (rescheduling) {
      setPopUpDisplay(true);
      setPopUpElement(reschedulePopUp);
    }
  }, [rescheduling, loading]);

  useEffect(() => {
    getUnreservedAppointments(appointment.doctorUsername);
  }, [appointment.doctorUsername]);

  return (
    <Cell>
      <Icon
        title="Request Follow-up"
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
    </Cell>
  );
}

export default PatientAppointmentActions;
