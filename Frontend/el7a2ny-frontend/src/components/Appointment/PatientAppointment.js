import PatientAppointmentInfo from "./PatientAppointmentInfo";
import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";

function PatientAppointment({ appointment, attributes, actions }) {
  console.log("PA", attributes)
  return (
    <Row hover key={appointment._id}> 
      <PatientAppointmentInfo appointment={appointment} attributes={attributes} />
      <Cell>{actions}</Cell>
    </Row>
  );
}

export default PatientAppointment;
