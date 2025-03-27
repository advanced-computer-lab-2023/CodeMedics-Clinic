import { useState, useContext } from "react";
import axios from "axios";
import { TableRow, TableCell, TextField } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import { TableContext } from "../Table/Table";
import PopUp from "../Miscellaneous/PopUp";
import FileSaver from "file-saver";
import Icon from "../Icon";
import { BACKEND_ROUTE } from "src/utils/Constants";
import { PATCH } from "src/utils/helper-functions";

function PatientPrescriptionActions({ state }) {
  const [viewing, setViewing] = useState(false);
  const { setShowError, setError, setAllData } = useContext(TableContext);
  const downloadPDF = async () => {
    try {
      console.log("State", state, state._id);
      const response = await axios.post(
        `${BACKEND_ROUTE}/patients/download-prescription-pdf`,
        { prescription: state },
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
    PATCH({
      url: `${BACKEND_ROUTE}/patients/prescriptions/${prescriptionID}`,
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) => {
          return prev.map((item) => {
            if (item._id != state._id) return item;
            return { ...item, filled: true };
          });
        });
      },
    });
  };

  console.log("PP rendered", state);

  const drugs = state.drug.map((drug, medicineIndex) => (
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
        <Icon
          title="View Prescription"
          onClick={() => {
            setViewing(true);
          }}
        >
          <EyeIcon />
        </Icon>
        <Icon
          disabled={state.filled}
          title="Fill Prescription"
          onClick={() => fillPrescription(state._id)}
        >
          <CheckCircleIcon />
        </Icon>
        <Icon title="Download as PDF" onClick={() => downloadPDF()}>
          <ArrowDownTrayIcon />
        </Icon>
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
