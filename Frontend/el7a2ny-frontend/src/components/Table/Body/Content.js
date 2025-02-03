import { Card, Table, TableBody } from "@mui/material";
import Head from "./Head";
import PatientPrescription from "src/components/Prescription/PatientPrescription";
import { useContext } from "react";
import { TableContext } from "src/components/Themes/PatientPrescriptionsTheme";
import { Box } from "@mui/system";

function Content() {
  const { elementType, setShowError, setError, columns, data } = useContext(TableContext);

  const content = data.map((item) => {
    if (elementType == "patientPrescription") {
      return <PatientPrescription prescription={item} />;
    } else {
      setShowError(true);
      setError("unhandled Table Element Type");
    }
  });

  return (
    <Card>
      <Box>
        <Table>
          <Head columns={columns} />
          <TableBody>{content}</TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default Content;
