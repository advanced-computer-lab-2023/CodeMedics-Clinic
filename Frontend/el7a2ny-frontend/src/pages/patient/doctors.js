import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState, useEffect } from "react";
import { Table } from "src/components/Table/Table";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import { useGet } from "src/hooks/custom-hooks";
import { useRouter } from "next/router";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Cookies from "js-cookie";

const Page = () => {
  const [date, setDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [speciality, setSpeciality] = useState("None");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get('username');
  const data = filterData();
  const specialities = [{ value: "None", label: "None" }];
  for (let i = 0; i < allData.length; i++) {
    if (!specialities.includes(allData[i].doctor.speciality)) {
      specialities.push({ value: allData[i].doctor.speciality, label: allData[i].doctor.speciality });
    }
  }

  console.log("doctors", data);

  const filters = [
    {
      type: "text",
      name: "Doctor Name",
      setState: setDoctorName,
    },
    {
      type: "datetime-local",
      name: "Available Date",
      setState: setDate,
    },
    {
      type: "menu",
      name: "Speciality",
      options: specialities,
      state: speciality,
      setState: setSpeciality,
    },
  ];

  const router = useRouter();

  function getSelectedDoctorAppointments(username) {
    router.push(`/patient/doctor-appointments?doctorUsername=${username}`);
  }

  function viewDoctorProfile(username, counter) {
    router.push(`/patient/doctor-info?doctorUsername=${username}&counter=${counter}`);
  }

  const actions = data.map((item, index) => [
    {
      name: "Appointments",
      onClick: () => getSelectedDoctorAppointments(item.doctor.username),
    },
    {
      name: "View Profile",
      onClick: () => viewDoctorProfile(item.doctor.username, index),
    },
  ]);

  const tableRows = data.map((item, index) => {
    return (
      <CardObject
        item={{ Picture: item.doctor.picture }}
        texts={[
          `${item.doctor.firstName} ${item.doctor.lastName}`,
          `${item.doctor.speciality}`,
          `${item.price} EGP`,
        ]}
        cardActionsElement={<CardActionsElement actions={actions[index]} />}
        index={index}
      />
    );
  });

  function filterData() {
    return allData.filter((item) => {
      const name = item.doctor.firstName + " " + item.doctor.lastName;
      if (doctorName !== "" && !name.includes(doctorName)) {
        return false;
      }
      if (speciality !== "None" && item.doctor.speciality !== speciality) {
        return false;
      }
      if (date) {
        const filteredDateTime = new Date(date);
        let hasAvailableAppointment = false;

        for (const appointment of item.appointments) {
          const appointmentStart = new Date(`${appointment.date}T${appointment.startHour}:00`);
          const appointmentEnd = new Date(`${appointment.date}T${appointment.endHour}:00`);

          if (filteredDateTime >= appointmentStart && filteredDateTime <= appointmentEnd) {
            hasAvailableAppointment = true;
            break;
          }
        }
        if (!hasAvailableAppointment) {
          return false;
        }
      }
      return true;
    });
  }

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/doctors`,
    setData: setAllData,
    setLoading,
    setShowError,
    setError,
  });

  useEffect(() => {
    if (allData && allData.length) filterData();
  }, [date, speciality, doctorName, allData]);

  return (
    <Table
      value={{
        data,
        loading,
        setShowError,
        setError,
        setLoading,
        noRecords: "No Doctors Found",
        setAllData,
        tableRows,
        displayGrid: "true",
        px: 250,
      }}
      filters={filters}
      title="Doctors"
    />
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
