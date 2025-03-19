import { Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SvgIcon } from "@mui/material";
import DocumentArrowUpIcon from "@heroicons/react/24/solid/DocumentArrowUpIcon";
import Message from "src/components/Miscellaneous/Message";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { useGet } from "src/hooks/custom-hooks";
import { DELETE } from "src/project-utils/helper-functions";
import FileSaver from "file-saver";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import { Table } from "src/components/Table/Table";

const Page = () => {
  const router = useRouter();
  const username = Cookies.get("username");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/health-records`,
    setShowError,
    setError,
    setData: setMedicalRecords,
    setLoading,
  });

  const removeMedicalRecord = (documentId) => {
    DELETE({
      url: `${BACKEND_ROUTE}/patients/${username}/medical-history/${documentId}`,
      setShowError,
      setError,
      updater: () => {
        setMedicalRecords((prev) => prev.filter((item) => item._id != documentId));
      },
    });
  };

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
              `${BACKEND_ROUTE}/patients/${username}/medical-history`,
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
            setError(error.response.data.message);
          }
        }
      });
      fileInput.click();
    } catch (error) {
      console.error("Error creating file input:", error);
      setShowError(true);
      setError(error.response.data.message);
    }
  };

  const actions = medicalRecords.map((item) => [
    {
      name: "Remove",
      onClick: () => {
        removeMedicalRecord(item._id);
      },
    },
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

  const uploadDocumentButton = (
    <Button
      component="span"
      size="medium"
      sx={{
        mt: 3,
        backgroundColor: "#F8F8F8",
        "&:hover": {
          backgroundColor: "#F1F1F1",
        },
      }}
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
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      <Table
        value={{
          loading,
          setShowError,
          setError,
          setLoading,
          noRecords: "No Medical History Found",
          tableRows,
          displayGrid: "true",
          px: 250,
        }}
        title="Medical History"
        actions={uploadDocumentButton}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
