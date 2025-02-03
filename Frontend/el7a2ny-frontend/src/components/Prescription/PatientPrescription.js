import { useState, useEffect } from "react";
import { TableRow, TableCell, Stack, Typography, IconButton, SvgIcon } from "@mui/material";
import { SeverityPill } from "src/components/severity-pill";
import PatientPrescriptionActions from "./PatientPrescriptionActions";

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
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography variant="subtitle2">{state.Doctor}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{state.Date}</TableCell>
      <TableCell>
        <SeverityPill color={statusMap[status]}>{status}</SeverityPill>
      </TableCell>
      <PatientPrescriptionActions setState={setState} state={state} />
    </TableRow>
  );
}

export default PatientPrescription;
