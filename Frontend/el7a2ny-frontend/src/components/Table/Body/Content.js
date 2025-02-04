import { Card, Table, TableBody } from "@mui/material";
import Head from "./Head";
import PatientPrescription from "src/components/Prescription/PatientPrescription";
import PatientAppointment from "src/components/Appointment/PatientAppointment"; 
import { useContext } from "react";
import { TableContext } from "../Table";
import { Box } from "@mui/system";

function Content() {
  const { elementType, setShowError, setError, columns, data, popUpDisplay, popUpElement } = useContext(TableContext);

  const content = data.map((item) => {
    if (elementType == "patientPrescription") {
      return <PatientPrescription prescription={item} />;
    }
    else if(elementType == "patientAppointment"){
      return <PatientAppointment appointment={item} />
    }
    else {
      setShowError(true);
      setError("unhandled Table Element Type");
    }
  });
  if(popUpDisplay){
    console.log("POP up display is true", popUpElement)
  }
  return (
    <Card>
      <Box>
        <Table>
          <Head columns={columns} />
          <TableBody>{content}</TableBody>
        </Table>
        {popUpDisplay && popUpElement}
      </Box>
    </Card>
  );
}

export default Content;
