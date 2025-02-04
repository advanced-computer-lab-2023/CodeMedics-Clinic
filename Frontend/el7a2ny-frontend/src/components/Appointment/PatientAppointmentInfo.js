import { TableCell } from "@mui/material";
function PatientAppointmentInfo({ appointment }) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (
    <>
      <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
      <TableCell>{days[new Date(appointment.date).getDay()]}</TableCell>
      <TableCell>{appointment.startHour}</TableCell>
      <TableCell>{appointment.endHour}</TableCell>
    </>
  );
}
export default PatientAppointmentInfo;
