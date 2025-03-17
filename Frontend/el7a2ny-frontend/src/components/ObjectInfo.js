import { TableCell } from "@mui/material";
import { SeverityPill } from "./severity-pill";
import DoctorDocument from "./DoctorDocument";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const statusMap = {
  filled: "success",
  unfilled: "warning",
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
    } else if (item == "filled") {
      const str = obj.filled ? "filled" : "unfilled";
      content = <SeverityPill color={statusMap[str]}>{str}</SeverityPill>;
    } else if (item == "name") {
      content = `${obj.firstName} ${obj.lastName}`;
    } else if (item == "documents") {
      content = (
        <>
          <DoctorDocument title="National ID" document={item.idDocument}/>
          <DoctorDocument title="Medical License" document={item.medicalLicense}/>
          <DoctorDocument title="Medical Degree" document={item.medicalDegree}/>
        </>
      );
    } else {
      content = obj[item];
    }
    return <TableCell>{content}</TableCell>;
  });
  return cells;
}
export default ObjectInfo;
