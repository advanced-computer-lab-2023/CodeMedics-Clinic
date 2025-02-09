import { useState, useEffect } from "react";
import { Table } from "src/components/Table/Table";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import { useRouter } from "next/router";
import axios from "axios";

function PatientDoctorsTheme() {
  const [date, setDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [speciality, setSpeciality] = useState("None");
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

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
    router.push(`/patient/appointments?doctorUsername=${username}`);
  }

  function viewDoctorProfile(username, counter) {
    router.push(`/patient/doctor-info?doctorUsername=${username}&counter=${counter}`);
  }

  const actions = data.map((item, index) => [
    {
      name: "Appointments",
      onClick: () => getSelectedDoctorAppointments(item.doctor.Username),
    },
    {
      name: "View Profile",
      onClick: () => viewDoctorProfile(item.doctor.Username, index),
    },
  ]);

  const tableRows = data.map((item, index) => {
    return (
      <CardObject
        item={{ Picture: item.doctor.Picture }}
        texts={[
          `${item.doctor.FirstName} ${item.doctor.LastName}`,
          `${item.doctor.Speciality}`,
          `${item.price} EGP`,
        ]}
        cardActionsElement={<CardActionsElement actions={actions[index]} />}
        index={index}
      />
    );
  });

  function filterData() {
    setData(
      allData.filter((doctor) => {
        const name = doctor.doctor.FirstName + " " + doctor.doctor.LastName;
        if (doctorName !== "" && !name.includes(doctorName)) {
          return false;
        }
        if (speciality !== "None" && doctor.doctor.Speciality !== speciality) {
          return false;
        }
        if (date) {
          const filteredDateTime = new Date(date);
          let hasAvailableAppointment = false;

          for (const appointment of doctor.Appointments) {
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
      })
    );
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/doctor/getDoctorsAndAppointments", { withCredentials: true })
      .then((response) => {
        return response.data.data;
      })
      .then((data) => {
        console.log("doctors", data);
        setAllData(data);
        const sepciality = [{ value: "None", label: "None" }];
        for (let i = 0; i < data.length; i++) {
          if (!sepciality.includes(data[i].doctor.Speciality)) {
            sepciality.push({ value: data[i].doctor.Speciality, label: data[i].doctor.Speciality });
          }
        }
        setSpecialities(sepciality);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowError(true);
        setError(error.response.data.message);
      });
  }, []);

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
        px: 250
      }}
      filters={filters}
      title="Doctors"
    />
  );
}
export default PatientDoctorsTheme;
