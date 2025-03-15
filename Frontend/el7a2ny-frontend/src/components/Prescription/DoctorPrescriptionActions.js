import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { TableRow, TableCell, Box, DialogActions, Button } from "@mui/material";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { TableContext } from "../Table/Table";
import FileSaver from "file-saver";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Icon from "../Icon";
import PopUp from "../Miscellaneous/PopUp";
import { DELETE, PATCH } from "src/project-utils/helper-functions";
import TextInput from "../Inputs/TextInput";

function DoctorPrescriptionActions({ item }) {
  const [prescription, setPrescription] = useState(item);
  const [drugs, setDrugs] = useState(item.drug);

  const [addingMedicine, setAddingMedicine] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("0");

  const [viewing, setViewing] = useState(false);

  const { setShowError, setError, setPopUpDisplay, setPopUpElement, setAllData } =
    useContext(TableContext);
  const username = Cookies.get("username");
  const downloadPDF = async () => {
    try {
      console.log("prescription", prescription, prescription._id);
      const response = await axios.post(
        `${BACKEND_ROUTE}/doctors/${username}/download-prescription-pdf`,
        { prescription: prescription },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Prescription_${prescription._id}.pdf`;
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setShowError(true);
      setError(error.response.data.message);
    }
  };

  function handleAddMedicine(prescriptionId, medicineName, dosage) {
    PATCH({
      url: `${BACKEND_ROUTE}/doctors/${username}/prescriptions/${prescriptionId}`,
      body: { medicineName, dosage },
      setShowError,
      setError,
      updater: () => {
        setPrescription((prev) => {
          const medicineData = { drugName: medicineName, dosage };
          let found = false;
          for (const drug of prev.drug) {
            if (drug.drugName == medicineName) {
              drug.dosage = dosage;
              found = true;
              break;
            }
          }
          if (!found) prev.drug.push(medicineData);
          return prev;
        });
      },
    });
  }

  function handleDeleteMedicine(prescriptionId, drugName) {
    DELETE({
      url: `${BACKEND_ROUTE}/doctors/${username}/prescriptions/${prescriptionId}/drugs/${drugName}`,
      setShowError,
      setError,
      updater: () => {
        if (prescription.drug.length == 1) {
          setAllData((prev) => prev.filter((item) => item._id != prescriptionId));
        }
        setPrescription((prev) => {
          return { ...prev, drug: prev.drug.filter((item) => item.drugName !== drugName) };
        });
      },
    });
  }

  function handleSaveClick(prescription, medicineIndex) {
    console.log(
      "Saving",
      prescription._id,
      drugs[medicineIndex].drugName,
      drugs[medicineIndex].dosage
    );
    handleAddMedicine(prescription._id, drugs[medicineIndex].drugName, drugs[medicineIndex].dosage);
  }

  const prescriptionPopUp = (
    <PopUp
      viewing={viewing}
      setViewing={setViewing}
      actionName={"Close"}
      setPopUpDisplay={setPopUpDisplay}
    >
      {prescription.drug.map((drug, medicineIndex) => (
        <TableRow hover key={medicineIndex}>
          <TableCell>{drug.drugName}</TableCell>
          <TableCell>
            <TextInput
              type="number"
              option="Dosage"
              defaultValue={drug.dosage}
              disabled={prescription.filled}
              setValue={(value) => {
                setDrugs((prev) => {
                  prev[medicineIndex].dosage = Number(value);
                  return prev;
                });
              }}
            />
          </TableCell>
          <TableCell>
            <Icon
              disabled={prescription.filled}
              title="Save Dosage"
              onClick={() => {
                handleSaveClick(prescription, medicineIndex);
                setPopUpDisplay(false);
                setViewing(false);
              }}
            >
              <PencilSquareIcon />
            </Icon>

            <Icon
              disabled={prescription.filled}
              title="Delete Medicine"
              onClick={() => {
                handleDeleteMedicine(prescription._id, drug.drugName);
                setPopUpDisplay(false);
                setViewing(false);
              }}
            >
              <XMarkIcon />
            </Icon>
          </TableCell>
        </TableRow>
      ))}
    </PopUp>
  );

  const addMedicinePopUp = (
    <PopUp
      viewing={addingMedicine}
      setViewing={setAddingMedicine}
      title="Enter the medicine name and dosage you want to add"
      setPopUpDisplay={setPopUpDisplay}
      actions={
        <DialogActions>
          <Button
            onClick={() => {
              setPopUpDisplay(false);
              setAddingMedicine(false);
              setMedicineName("");
              setDosage("0");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddMedicine(prescription._id, medicineName, dosage);
              setPopUpDisplay(false);
              setAddingMedicine(false);
            }}
            disabled={medicineName === "" || Number(dosage) <= 0}
          >
            Save
          </Button>
        </DialogActions>
      }
    >
      <Box>
        <TextInput
          type="text"
          option="Medicine Name"
          defaultValue=""
          setValue={setMedicineName}
          addMargin={true}
        />
        <TextInput
          type="number"
          option="Dosage"
          defaultValue={"0"}
          setValue={(value) => {
            setDosage(value);
          }}
          addMargin={true}
        />
      </Box>
    </PopUp>
  );

  useEffect(() => {
    if (addingMedicine) {
      setPopUpDisplay(true);
      setPopUpElement(addMedicinePopUp);
    } else {
      setMedicineName("");
      setDosage("0");
    }
    if (viewing) {
      setPopUpDisplay(true);
      setPopUpElement(prescriptionPopUp);
    }
  }, [addingMedicine, viewing, medicineName, dosage]);

  return (
    <>
      <TableCell>
        <Icon
          disabled={prescription.filled}
          title="Add Medicine"
          onClick={() => {
            setAddingMedicine(true);
          }}
        >
          <PlusIcon />
        </Icon>
        <Icon
          title="View Prescription"
          onClick={() => {
            setViewing(true);
          }}
        >
          <EyeIcon />
        </Icon>
        <Icon title="Download as PDF" onClick={() => downloadPDF()}>
          <ArrowDownTrayIcon />
        </Icon>
      </TableCell>
    </>
  );
}

export default DoctorPrescriptionActions;
