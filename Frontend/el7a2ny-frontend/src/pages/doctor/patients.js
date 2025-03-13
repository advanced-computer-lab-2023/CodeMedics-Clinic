import { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/doctor/layout";
import { useGet } from "src/hooks/custom-hooks";
import Cookies from "js-cookie";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import { Table } from "src/components/Table/Table";
import ObjectInfo from "src/components/ObjectInfo";
import { DoctorPatientActions } from "src/components/DoctorPatientActions";

const columns = ["Name", "Email", "Date Of Birth", "Actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [upcoming, setUpcoming] = useState("None");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [popUpDisplay, setPopUpDisplay] = useState(false);
  const [popUpElement, setPopUpElement] = useState();

  const username = Cookies.get("username");

  const filters = [
    {
      type: "text",
      name: "Search Patient Name",
      state: searchName,
      setState: setSearchName,
    },
    {
      type: "menu",
      name: "Upcoming",
      state: upcoming,
      setState: setUpcoming,
      options: [
        { value: "None", label: "None" },
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
  ];

  useGet({
    url: `${BACKEND_ROUTE}/doctors/${username}/patients`,
    setData: setAllData,
    setLoading,
    setError,
    setShowError,
  });

  const handleData = () => {
    return allData.filter((item) => {
      if (
        searchName !== "" &&
        !`${item.patient.firstName} ${item.patient.lastName}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      )
        return false;
      if (
        upcoming !== "None" &&
        ((upcoming == "Yes" && item.upcoming) || (upcoming == "No" && !item.upcoming))
      )
        return false;
      return true;
    });
  };

  const data = handleData();

  console.log("Data", data);

  const tableRows = data.map((item) => {
    console.log("item", item);
    return (
      <>
        <ObjectInfo obj={item.patient} attributes={["username", "email", "dateOfBirth"]} />
        <DoctorPatientActions patient={item.patient} />
      </>
    );
  });

  return (
    <Table
      value={{
        data,
        columns,
        loading,
        setShowError,
        setError,
        setLoading,
        noRecords: "No Patients Found",
        setAllData,
        tableRows,
        popUpDisplay,
        popUpElement,
        setPopUpDisplay,
        setPopUpElement,
      }}
      filters={filters}
      title="Patients"
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
