import { useState, useContext } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { TableRow, TableCell, TextField, IconButton, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import { TableContext } from "../Themes/PatientPrescriptionsTheme";
import PopUp from "../Miscellaneous/PopUp";
import FileSaver from 'file-saver';



function PatientPrescriptionActions({ state }) {
  const [viewing, setViewing] = useState(false);
  const { setShowError, setError, setLoading, setAllData, setData } = useContext(TableContext);
  const downloadPDF = async () => {
    try {
      console.log("State", state, state._id)
      const response = await axios.post(
        `http://localhost:8000/patient/download-prescription-pdf`,
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
    try {
      console.log("before filling", state)
      setLoading(true);
      await axios
        .patch(`http://localhost:8000/patient/fillPrescription`, {
          Username: Cookies.get("username"),
          prescriptionID: prescriptionID,
        })
        .then((response) => {
          console.log(response.data);
          setAllData(prev => {
            const temp = prev.map(item => {
              if(item._id != state._id)
                return item
              return {...item, filled: true}
            })
            setData(temp)
            return temp
          })
          setLoading(false);
        });
    } catch (error) {
      console.error("Error filling prescription: ", error);
      setShowError(true);
      console.log(err)
      setError(error.response.data.message);
    }
  };

  console.log("PP rendered", state)

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
        <IconButton title="Download as PDF" onClick={() => downloadPDF()}>
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
