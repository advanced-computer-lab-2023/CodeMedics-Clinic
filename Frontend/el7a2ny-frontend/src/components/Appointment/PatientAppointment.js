import { TableRow, TableCell, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SeverityPill } from "../severity-pill";
import PatientAppointmentActions from "./PatientAppointmentActions";
import PatientAppointmentInfo from "./PatientAppointmentInfo";

const statusMap = {
  upcoming: "warning",
  cancelled: "error",
  completed: "success",
  rescheduled: "warning",
};

function PatientAppointment({ appointment }) {
  return (
    <TableRow hover key={appointment._id}>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography variant="subtitle2">{appointment.doctor}</Typography>
        </Stack>
      </TableCell>
      <PatientAppointmentInfo appointment={appointment} />
      <TableCell>
        <SeverityPill color={statusMap[appointment.status]}>{appointment.status}</SeverityPill>
      </TableCell>
      <TableCell>
        <PatientAppointmentActions appointment={appointment} />
      </TableCell>
    </TableRow>
  );
}

export default PatientAppointment;
