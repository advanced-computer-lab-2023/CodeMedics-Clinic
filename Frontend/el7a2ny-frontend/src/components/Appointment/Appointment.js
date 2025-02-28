import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";
import AppointmentInfo from "./AppointmentInfo";

function Appointment({ appointment, attributes, actions }) {
  console.log("PA", attributes)
  return (
    <Row hover key={appointment._id}> 
      <AppointmentInfo appointment={appointment} attributes={attributes} />
      <Cell>{actions}</Cell>
    </Row>
  );
}

export default Appointment;
