import { useState, useEffect } from "react";
import { TableRow, TableCell, Stack, Typography, IconButton, SvgIcon } from "@mui/material";
import { SeverityPill } from "src/components/SeverityPill";
import PatientPrescriptionActions from "./PatientPrescriptionActions";
import ObjectInfo from "../ObjectInfo";

const statusMap = {
  filled: "success",
  unfilled: "warning",
};

function PatientPrescription({ prescription }) {
  const [state, setState] = useState(prescription);
  const status = state.filled ? "filled" : "unfilled";

  useEffect(() => {
    setState(prescription);
  }, [prescription]);

  return (
    <TableRow hover key={state._id}>
      <ObjectInfo obj={state} attributes={["doctorUsername", "date", "filled"]} />
      <PatientPrescriptionActions setState={setState} state={state} />
    </TableRow>
  );
}

export default PatientPrescription;
