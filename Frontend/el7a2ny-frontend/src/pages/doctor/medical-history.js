import { Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SvgIcon } from "@mui/material";
import DocumentArrowUpIcon from "@heroicons/react/24/solid/DocumentArrowUpIcon";
import FileSaver from "file-saver";
import Message from "src/components/Miscellaneous/Message";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { Table } from "src/components/Table/Table";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const patientUsername = new URLSearchParams(window.location.search).get("patientUsername");

  useGet({
    url: `${BACKEND_ROUTE}/doctors/patients/${patientUsername}/health-records`,
    setData: setMedicalRecords,
    setLoading,
    setShowError,
    setError,
  });

  console.log("My Records: ", medicalRecords);

  const handleUpload = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf, .doc, .docx, .png, .jpg, .jpeg";
      fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("document", file);

          try {
            const response = await axios.post(
              `${BACKEND_ROUTE}/doctors/patients/${patientUsername}/health-records`,
              formData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("File uploaded successfully:", response);
            router.refresh();
          } catch (error) {
            console.error("Error uploading file:", error);
            setShowError(true);
            setErrorMessage(error.response.data.message);
          }
        }
      });
      fileInput.click();
    } catch (error) {
      console.error("Error creating file input:", error);
      setShowError(true);
      setErrorMessage(error.response.data.message);
    }
  };

  const actions = medicalRecords.map((item) => [
    {
      name: "Download",
      onClick: () => {
        FileSaver.saveAs(`/uploads/${item.filename}`, `${item.filename}`);
      },
    },
  ]);

  const tableRows = medicalRecords.map((item, index) => (
    <CardObject
      item={{ src: "/assets/google-docs.png" }}
      texts={[item.filename || "No Filename"]}
      variants={["subtitle1"]}
      cardActionsElement={<CardActionsElement actions={actions[index]} />}
    />
  ));

  const tableActions = (
    <Button
      variant="contained"
      endIcon={
        <SvgIcon fontSize="small">
          <DocumentArrowUpIcon />
        </SvgIcon>
      }
      onClick={handleUpload}
    >
      Upload Medical Records
    </Button>
  );

  return (
    <>
      <Table
        value={{
          data: medicalRecords,
          loading,
          setShowError,
          setError,
          setLoading,
          displayGrid: "true",
          px: 250,
          noRecords: "No Medical History Found",
          tableRows,
        }}
        title="Medical History"
        actions={tableActions}
      />
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
