import { TableRow, TableCell, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SeverityPill } from "../severity-pill";
import PatientAppointmentActions from "./PatientAppointmentActions";
import PatientAppointmentInfo from "./PatientAppointmentInfo";
import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";

const statusMap = {
  upcoming: "warning",
  cancelled: "error",
  completed: "success",
  rescheduled: "warning",
};

function PatientAppointment({ appointment }) {
  return (
    <Row hover key={appointment._id}>
      <Cell>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography variant="subtitle2">{appointment.doctor}</Typography>
        </Stack>
      </Cell>
      <PatientAppointmentInfo appointment={appointment} />
      <Cell>
        <SeverityPill color={statusMap[appointment.status]}>{appointment.status}</SeverityPill>
      </Cell>
      <Cell>
        <PatientAppointmentActions appointment={appointment} />
      </Cell>
    </Row>
  );
}

export default PatientAppointment;
