import { useState } from "react";
import axios from "axios";
import { patientUpdateRoute } from "src/project-utils/Constants";
import Form from "../Form";

function AccountDetails({ user }) {
  const values = {
    FirstName: user.FirstName,
    LastName: user.LastName,
    Username: user.Username,
    Email: user.Email,
    Number: user.Number,
    DateOfBirth: user.DateOfBirth,
    EmergencyContactName: user.EmergencyContact.Name,
    EmergencyContactNumber: user.EmergencyContact.Number,
    EmergencyContactRelation: user.EmergencyContact.Relation,
  };

  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const [username, setUsername] = useState(user.Username);
  const [email, setEmail] = useState(user.Email);
  const [number, setNumber] = useState(user.Number);
  const [dateOfBirth, setDateOfBirth] = useState(user.DateOfBirth);
  const [emergencyContactName, setEmergencyContactName] = useState(user.EmergencyContact.Name);
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(
    user.EmergencyContact.Number
  );
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(
    user.EmergencyContact.Relation
  );

  const fields = [
    {
      name: "FirstName",
      label: "First Name",
      type: "text",
      value: firstName,
      setValue: setFirstName,
    },
    {
      name: "LastName",
      label: "Last Name",
      type: "text",
      value: lastName,
      setValue: setLastName,
    },
    {
      name: "Username",
      label: "Username",
      type: "text",
      value: username,
      setValue: setUsername,
    },
    {
      name: "Email",
      label: "Email",
      type: "email",
      value: email,
      setValue: setEmail,
    },
    {
      name: "Number",
      label: "Phone Number",
      type: "text",
      value: number,
      setValue: setNumber,
    },
    {
      name: "DateOfBirth",
      label: "Date Of Birth",
      type: "date",
      value: dateOfBirth,
      setValue: setDateOfBirth,
    },
    {
      name: "EmergencyContactName",
      label: "Emergency Contact Name",
      type: "text",
      value: emergencyContactName,
      setValue: setEmergencyContactName,
    },
    {
      name: "EmergencyContactNumber",
      label: "Emergency Contact Number",
      type: "text",
      value: emergencyContactNumber,
      setValue: setEmergencyContactNumber,
    },
    {
      name: "EmergencyContactRelation",
      label: "Emergency Contact Relation",
      type: "text",
      value: emergencyContactRelation,
      setValue: setEmergencyContactRelation,
    },
  ];

  const onSubmit = async (user, helpers) => {
    try {
      const body = {
        FirstName: user.FirstName,
        LastName: user.LastName,
        Username: user.Username,
        Email: user.Email,
        DateOfBirth: user.DateOfBirth,
        Number: user.Number,
        Gender: user.Gender,
        EmergencyContact: {
          Name: user.EmergencyContactName,
          Number: user.EmergencyContactNumber,
          Relation: user.EmergencyContactRelation,
        },
      };
      await axios(patientUpdateRoute, {
        method: "PATCH",
        data: body,
        withCredentials: true,
      })
        .then((res) => {
          if (res.status != 200) {
            throw new Error(res.data.message);
          }
          return res["data"];
        })
        .then((data) => {
          window.location.reload();
        });
    } catch (err) {
      console.log("err", err)
      helpers.setStatus({ success: false });
      helpers.setErrors({ Submit: err.response.data.message });
      helpers.setSubmitting(false);
    }
  };
  return (
    <div>
      <Form title="Profile" fields={fields} actionName="save" onSubmit={onSubmit} values={values}/>
    </div>
  );
}
export default AccountDetails;
