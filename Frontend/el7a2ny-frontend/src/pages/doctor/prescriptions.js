import { useEffect, useState } from "react";
import { Button, Stack, SvgIcon, TableCell, TableRow } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Cookies from "js-cookie";
import { Table } from "src/components/Table/Table";
import ObjectInfo from "src/components/ObjectInfo";
import DoctorPrescriptionActions from "src/components/Prescription/DoctorPrescriptionActions";
import Message from "src/components/Miscellaneous/Message";
import { PlusIcon } from "@heroicons/react/24/solid";
import PopUp from "src/components/Miscellaneous/PopUp";
import TextInput from "src/components/Inputs/TextInput";
import ButtonElement from "src/components/ButtonElement";
import { POST } from "src/project-utils/helper-functions";

const columns = ["Patient", "Date", "Status", "Actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientUsername, setPatientUsername] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  const patientUsernameFilter = new URLSearchParams(window.location.search).get("patientUsername");

  function filterData() {
    return allData.filter((item) => {
      const itemDate = new Date(item.date);

      if (startDate && itemDate < new Date(startDate)) return false;

      if (endDate && itemDate > new Date(endDate)) return false;

      if (patientName && !item.patientUsername.includes(patientName)) return false;

      if (patientUsernameFilter && item.patientUsername != patientUsernameFilter) {
        return false;
      }

      return true;
    });
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${username}/prescriptions`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  const filters = [
    {
      type: "text",
      name: "Search Patient Name",
      setState: setPatientName,
    },
    {
      type: "date",
      name: "Start Date",
      setState: setStartDate,
    },
    {
      type: "date",
      name: "End Date",
      setState: setEndDate,
    },
  ];

  const tableRows = data.map((item) => {
    return (
      <TableRow>
        <ObjectInfo obj={item} attributes={["patientUsername", "date", "filled"]} />
        <DoctorPrescriptionActions item={item} />
      </TableRow>
    );
  });

  const drugsElement = drugs.map((item, index) => {
    return (
      <TableRow>
        <TableCell>
          <TextInput
            type="text"
            option="Medicine name"
            defaultValue={item.drugName}
            setValue={(value) => {
              setDrugs((prev) => {
                const newDrugs = [...prev];
                newDrugs[index].drugName = value;
                return newDrugs;
              });
            }}
          />
        </TableCell>
        <TableCell>
          <TextInput
            type="number"
            option="Dosage"
            defaultValue={item.dosage}
            setValue={(value) => {
              setDrugs((prev) => {
                const newDrugs = [...prev];
                newDrugs[index].dosage = value;
                return newDrugs;
              });
            }}
          />
        </TableCell>
        <TableCell>
          <ButtonElement
            actionName="Remove"
            onClick={() => {
              setDrugs((prev) =>
                prev.filter((item, i) => {
                  return index != i;
                })
              );
            }}
          />
        </TableCell>
      </TableRow>
    );
  });

  const createPrescriptionPopUp = () => (
    <PopUp
      title="Add Prescription"
      viewing={popUpDisplay}
      setViewing={setPopUpDisplay}
      actions={
        <>
          <ButtonElement
            actionName="Cancel"
            onClick={() => {
              setPopUpDisplay(false);
              setPopUpElement(null);
            }}
          />
          <ButtonElement
            actionName="Submit"
            onClick={() => {
              setPopUpDisplay(false);
              setPopUpElement(null);
              POST({
                url: `${BACKEND_ROUTE}/doctors/${username}/prescriptions`,
                body: { patientUsername, drugs, date: prescriptionDate },
                setShowError,
                setError,
                updater: () => {
                  window.location.reload();
                },
              });
            }}
          />
        </>
      }
    >
      <TableRow>
        <TableCell>
          <Stack alignItems="center" direction="row" spacing={1}>
            <TextInput
              type="text"
              option="Patient Username"
              defaultValue={patientUsername}
              setValue={setPatientUsername}
            />
            <TextInput
              type="Date"
              option="Date"
              defaultValue={prescriptionDate ? prescriptionDate : new Date()}
              setValue={setPrescriptionDate}
            />
          </Stack>
        </TableCell>
      </TableRow>
      {drugsElement}
      <TableRow>
        <ButtonElement
          actionName="Add Medicine"
          onClick={() => {
            setDrugs((prev) => [...prev, { drugName: "", dosage: "0" }]);
          }}
        />
      </TableRow>
    </PopUp>
  );

  const tableActions = (
    <Button
      startIcon={
        <SvgIcon fontSize="small">
          <PlusIcon />
        </SvgIcon>
      }
      variant="contained"
      onClick={() => {
        setPopUpElement(createPrescriptionPopUp());
        setPopUpDisplay(true);
      }}
    >
      Add Patient Prescription
    </Button>
  );

  useEffect(() => {
    if (popUpDisplay) {
      setPopUpElement(createPrescriptionPopUp());
    }
  }, [patientUsername, drugs, prescriptionDate, popUpDisplay]);

  return (
    <>
      <Table
        value={{
          data,
          columns,
          loading,
          setShowError,
          setError,
          setLoading,
          noRecords: "No Prescriptions Found",
          setAllData,
          tableRows,
          popUpDisplay,
          setPopUpDisplay,
          popUpElement,
          setPopUpElement,
        }}
        title="Prescriptions"
        filters={filters}
        actions={tableActions}
      />
      <Message
        condition={showError}
        setCondition={setShowError}
        title="Error"
        message={error}
        action="Close"
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
