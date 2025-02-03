import { TableRow, TableCell, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SeverityPill } from "../severity-pill";
import PatientAppointmentActions from "./PatientAppointmentActions";

function PatientAppointment({ appointment }) {
  const statusMap = {
    upcoming: "warning",
    cancelled: "error",
    completed: "success",
    rescheduled: "warning",
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <TableRow hover key={appointment._id}>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography variant="subtitle2">{appointment.doctor}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
      <TableCell>{days[new Date(appointment.date).getDay()]}</TableCell>
      <TableCell>{appointment.startHour}</TableCell>
      <TableCell>{appointment.endHour}</TableCell>
      <TableCell>
        <SeverityPill color={statusMap[appointment.status]}>{appointment.status}</SeverityPill>
      </TableCell>
      <TableCell>
        <PatientAppointmentActions appointment={appointment}/>
      </TableCell>
    </TableRow>
  );
}

export default PatientAppointment;