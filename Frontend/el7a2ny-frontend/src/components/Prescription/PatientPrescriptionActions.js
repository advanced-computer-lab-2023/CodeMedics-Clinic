import { useState, useContext } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { TableRow, TableCell, TextField, IconButton, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import { TableContext } from "../Themes/PatientPrescriptionsTheme";
import PopUp from "../Miscellaneous/PopUp";

function PatientPrescriptionActions({ state, setState }) {
  const [viewing, setViewing] = useState(false);
  const { setShowError, setError, setLoading, data } = useContext(TableContext);
  console.log(state._id)
  console.log(data)
  const downloadPDF = async (state) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/patient/download-prescription-pdf`,
        { state },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Prescription_${state._id}.pdf`;
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setShowError(true);
      setError(error.response.data.message);
    }
  };

  const fillPrescription = async (prescriptionID) => {
    try {
      setLoading(true);
      await axios
        .patch(`http://localhost:8000/patient/fillPrescription`, {
          Username: Cookies.get("username"),
          prescriptionID: prescriptionID,
        })
        .then((response) => {
          console.log(response.data);
          setState((prev) => ({
            ...prev,
            filled: true,
          }));
          setLoading(false);
        });
    } catch (error) {
      console.error("Error filling prescription: ", error);
      setShowError(true);
      console.log(err)
      setError(error.response.data.message);
    }
  };

  const drugs = state.Drug.map((drug, medicineIndex) => (
    <TableRow hover key={medicineIndex}>
      <TableCell>{drug.drugName}</TableCell>
      <TableCell>
        <TextField type="text" label="Dosage" value={drug.dosage} disabled />
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <TableCell>
        <IconButton
          title="View Prescription"
          onClick={() => {
            setViewing(true);
          }}
        >
          <SvgIcon fontSize="small">
            <EyeIcon />
          </SvgIcon>
        </IconButton>
        <IconButton
          disabled={state.filled}
          title="Fill Prescription"
          onClick={() => fillPrescription(state._id)}
        >
          <SvgIcon fontSize="small">
            <CheckCircleIcon />
          </SvgIcon>
        </IconButton>
        <IconButton title="Download as PDF" onClick={() => downloadPDF(state)}>
          <SvgIcon fontSize="small">
            <ArrowDownTrayIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
      {viewing && (
        <PopUp
          title="Prescription"
          viewing={viewing}
          setViewing={setViewing}
          tableCells={["Drug", "Dosage"]}
          actionName="Close"
        >
          {drugs}
        </PopUp>
      )}
    </>
  );
}

export default PatientPrescriptionActions;
