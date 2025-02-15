import { TableCell } from "@mui/material";
import { SeverityPill } from "../severity-pill";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const statusMap = {
  upcoming: "warning",
  cancelled: "error",
  completed: "success",
  rescheduled: "warning",
};

function PatientAppointmentInfo({ appointment, attributes }) {
  console.log("PAI", attributes);
  const cells = attributes.map((item) => {
    let content;
    if (item === "date") {
      content = new Date(appointment.date).toLocaleDateString();
    } else if (item == "day") {
      content = days[new Date(appointment.date).getDay()];
    } else if (item === "status") {
      content = (
        <SeverityPill color={statusMap[appointment.status]}>{appointment.status}</SeverityPill>
      );
    } else {
      content = appointment[item];
    }
    return <TableCell>{content}</TableCell>;
  });
  return cells;
}
export default PatientAppointmentInfo;
