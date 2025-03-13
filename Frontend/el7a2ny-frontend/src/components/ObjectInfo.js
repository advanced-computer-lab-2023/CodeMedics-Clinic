import { TableCell } from "@mui/material";
import { SeverityPill } from "./severity-pill";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const statusMap = {
  upcoming: "warning",
  cancelled: "error",
  completed: "success",
  rescheduled: "warning",
};

function ObjectInfo({ obj, attributes }) {
  const cells = attributes.map((item) => {
    let content;
    if (item === "date") {
      content = new Date(obj.date).toLocaleDateString();
    } else if (item == "day") {
      content = days[new Date(obj.date).getDay()];
    } else if (item === "status") {
      content = <SeverityPill color={statusMap[obj.status]}>{obj.status}</SeverityPill>;
    } else {
      content = obj[item];
    }
    return <TableCell>{content}</TableCell>;
  });
  return cells;
}
export default ObjectInfo;
