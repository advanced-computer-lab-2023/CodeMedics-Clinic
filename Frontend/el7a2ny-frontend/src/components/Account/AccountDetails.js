import { useState } from "react";
import axios from "axios";
import { BACKEND_ROUTE, patientUpdateRoute } from "src/project-utils/constants";
import Form from "../Form";
import { PATCH } from "src/project-utils/helper-functions";

function AccountDetails({ user }) {
  const values = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    number: user.number,
    dateOfBirth: user.dateOfBirth,
    emergencyContactName: user.emergencyContact.name,
    emergencyContactNumber: user.emergencyContact.number,
    emergencyContactRelation: user.emergencyContact.relation,
  };

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [number, setNumber] = useState(user.number);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
  const [emergencyContactName, setEmergencyContactName] = useState(user.emergencyContact.name);
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(
    user.emergencyContact.number
  );
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(
    user.emergencyContact.relation
  );
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      value: firstName,
      setValue: setFirstName,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      value: lastName,
      setValue: setLastName,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      value: username,
      setValue: setUsername,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: email,
      setValue: setEmail,
    },
    {
      name: "number",
      label: "Phone Number",
      type: "text",
      value: number,
      setValue: setNumber,
    },
    {
      name: "dateOfBirth",
      label: "Date Of Birth",
      type: "date",
      value: dateOfBirth,
      setValue: setDateOfBirth,
    },
    {
      name: "emergencyContactName",
      label: "Emergency Contact Name",
      type: "text",
      value: emergencyContactName,
      setValue: setEmergencyContactName,
    },
    {
      name: "emergencyContactNumber",
      label: "Emergency Contact Number",
      type: "text",
      value: emergencyContactNumber,
      setValue: setEmergencyContactNumber,
    },
    {
      name: "emergencyContactRelation",
      label: "Emergency Contact Relation",
      type: "text",
      value: emergencyContactRelation,
      setValue: setEmergencyContactRelation,
    },
  ];

  const onSubmit = async (user, helpers) => {
    try {
      const body = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        number: user.number,
        gender: user.gender,
        emergencyContact: {
          name: user.emergencyContactName,
          number: user.emergencyContactNumber,
          relation: user.emergencyContactRelation,
        },
      };
      PATCH({
        url: `${BACKEND_ROUTE}/patients/${username}`,
        body,
        setShowError,
        setError,
        updater: () => {
          window.location.reload();
        },
      });
    } catch (err) {
      console.log("err", err);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.response?.data?.message || "An error occurred" });
      helpers.setSubmitting(false);
    }
  };

  return (
    <div>
      <Form title="Profile" fields={fields} actionName="save" onSubmit={onSubmit} values={values} />
    </div>
  );
}

export default AccountDetails;
