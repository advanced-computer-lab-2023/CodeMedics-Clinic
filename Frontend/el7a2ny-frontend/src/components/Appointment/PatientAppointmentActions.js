import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TableCell, IconButton, SvgIcon, Table, Button, TableRow, TableBody } from "@mui/material";
import ChecklistIcon from "src/icons/untitled-ui/duocolor/ChecklistIcon";
import RescheduleIcon from "src/icons/untitled-ui/duocolor/RescheduleIcon";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { TableContext } from "../Table/Table";
import LoadingSpinner from "../LoadingSpinner";
import PopUp from "../Miscellaneous/PopUp";
import Head from "../Table/Body/Head";
import PatientAppointmentInfo from "./PatientAppointmentInfo";

function PatientAppointmentActions({ appointment }) {
  const { setShowError, setError, setAllData, currentPatient, setPopUpDisplay, setPopUpElement } = useContext(TableContext);
  const [loading, setLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);

  const unreservedAppointmentsElements = unreservedAppointments.map((item) => {
    return (
      <TableRow key={item._id}>
        <PatientAppointmentInfo appointment={item} />
        <TableCell>
          <Button
            onClick={() => {
              hanldeRescheduleAppointment(item, appointment);
              setRescheduling(false)
              setPopUpDisplay(false)
            }}
          >
            Reschedule
          </Button>
        </TableCell>
      </TableRow>
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
      {loading ? <LoadingSpinner /> : (
        <Table>
          {unreservedAppointments.length ? (
            <>
              <Head columns={["Date", "Day", "From", "To"]} />
              <TableBody>{unreservedAppointmentsElements}</TableBody>
            </>
          ) : (
            <TableRow>
              <TableCell>Sorry, No Available Slots!</TableCell>
            </TableRow>
          )}
        </Table>
      )}
    </PopUp>
  );

  useEffect(() => {
    if (rescheduling) {
      setPopUpDisplay(true);
      setPopUpElement(reschedulePopUp);
    }
  }, [rescheduling]);

  const getUnreservedAppointments = async (doctorUsername) => {
    setLoading(true);
    await axios
      .get("http://localhost:8000/patient/getFreeSlotsOfDoctor?doctorUsername=" + doctorUsername)
      .then((res) => {
        console.log(doctorUsername, "unreserved slots", res.data.appointments)
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
      .patch(`http://localhost:8000/patient/RequestFollowUp?appointmentID=${appointmentID}`)
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
        `http://localhost:8000/patient/RescheduleAppointment?appointmentID=${curAppointment._id}&oldAppointmentID=${oldAppointment._id}&username=${currentPatient}`
      )
      .then((res) => {
        console.log("LLL", res)
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
      .patch(`http://localhost:8000/patient/CancelAppointment?appointmentID=${appointmentID}`)
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
    getUnreservedAppointments(appointment.doctorUsername);
  }, [appointment.doctorUsername]);

  return (
    <>
      <TableCell>
        <IconButton
          title="Request Follow-up"
          onClick={() => {
            handleRequestFollowUp(appointment._id);
          }}
        >
          <SvgIcon fontSize="small">
            <ChecklistIcon />
          </SvgIcon>
        </IconButton>
        <IconButton
          disabled={!(appointment.status === "upcoming" || appointment.status === "rescheduled")}
          title="Reschedule Appointment"
          onClick={() => {
            setRescheduling(true); // This will trigger the useEffect
          }}
        >
          <SvgIcon fontSize="small">
            <RescheduleIcon />
          </SvgIcon>
        </IconButton>
        <IconButton
          title="Cancel Appointment"
          onClick={() => {
            handleCancelAppointment(appointment._id);
          }}
        >
          <SvgIcon fontSize="small">
            <CancelIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
    </>
  );
}

export default PatientAppointmentActions;