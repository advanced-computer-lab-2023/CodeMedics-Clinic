import { useContext } from "react";
import axios from "axios";
import { TableCell, IconButton, SvgIcon } from "@mui/material";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import ChecklistIcon from "src/icons/untitled-ui/duocolor/ChecklistIcon";
import RescheduleIcon from "src/icons/untitled-ui/duocolor/RescheduleIcon";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { TableContext } from "../Table/Table";

function PatientAppointmentActions({ appointment }) {
  const { setShowError, setError, setAllData } = useContext(TableContext);
  const handleRequestFollowUp = async (appointmentID) => {
    await axios
      .patch(`http://localhost:8000/patient/RequestFollowUp?appointmentID=${appointmentID}`)
      .then((res) => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id != appointmentID) return item;
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

  const hanldeRescheduleAppointment = async (appointmentID, oldAppointmentID) => {
    await axios.patch(`http://localhost:8000/patient/RescheduleAppointment?appointmentID=${appointmentID}&oldAppointmentID=${oldAppointment}&username=${curUsername}`).then
    ((res) => {
      console.log(res);
      window.location.reload();
    }
    ).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.message);
    });
  };

  const handleCancelAppointment = async (appointmentID) => {
    await axios.patch(`http://localhost:8000/patient/CancelAppointment?appointmentID=${appointmentID}`).then(res =>{
      setAllData(prev => prev.map(
        item => {
            if(item._id != appointmentID)
                return item
            return {...item, status: "cancelled"}
        }
      ))
    }).catch((err) => {
      console.log(err);
      setShowError(true);
      setErrorMessage(err.response.data.message);
    });
  };


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
          disabled={appointment.status == "upcoming" || appointment.status == "rescheduled"}
          title="Reschedule Appointment"
          onClick={() => {}}
        >
          <SvgIcon fontSize="small">
            <RescheduleIcon />
          </SvgIcon>
        </IconButton>
        <IconButton title="Cancel Appointment" onClick={() => {handleCancelAppointment(appointment._id)}}>
          <SvgIcon fontSize="small">
            <CancelIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
    </>
  );
}

export default PatientAppointmentActions;
