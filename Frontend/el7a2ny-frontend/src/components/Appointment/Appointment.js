import Cell from "../Table/BasicElements/Cell";
import Row from "../Table/BasicElements/Row";
import ObjectInfo from "../ObjectInfo";

function Appointment({ appointment, attributes, actions }) {
  console.log("PA", attributes)
  return (
    <Row hover key={appointment._id}> 
      <ObjectInfo obj={appointment} attributes={attributes} />
      <Cell>{actions}</Cell>
    </Row>
  );
}

export default Appointment;
