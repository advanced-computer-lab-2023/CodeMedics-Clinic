import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "src/components/Form";
import { familyMembersPageRoute } from "src/project-utils/Constants";

const Genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Other",
    label: "Other",
  },
];

function AddFamilyMemberNoAccountInfo() {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [relationship, setRelationship] = useState("");

  const fields = [
    {
      name: "Name",
      label: "Name",
      value: name,
      type: "text",
      setValue: setName,
    },
    {
      name: "Relationship",
      label: "Relationship",
      value: relationship,
      type: "text",
      setValue: setRelationship,
    },
    {
      name: "NationalId",
      label: "National ID",
      type: "text",
      value: nationalId,
      setValue: setNationalId,
    },
    {
      name: "DateOfBirth",
      label: "Date Of Birth",
      type: "date",
      value: dateOfBirth,
      setValue: setDateOfBirth,
    },
    {
      name: "Gender",
      label: "Gender",
      value: gender,
      type: "menu",
      setValue: setGender,
      options: Genders,
    },
  ];

  const router = useRouter();

  const onSubmit = async (values, helpers) => {
    try {
      const body = {
        Name: values.Name,
        NationalId: values.NationalId,
        Gender: values.Gender,
        DateOfBirth: values.DateOfBirth,
        Relationship: values.Relationship,
      };
      console.log(body)
      await axios("http://localhost:8000/patient/familyMembersNoAccount", {
        method: "POST",
        data: body,
        withCredentials: true,
      }).then((res) => {
        if (res.status != 200) {
          throw new Error(res.data.message);
        }
        router.push(familyMembersPageRoute);
      });
    } catch (err) {
      console.log("in the error", err);
      helpers.setStatus({ success: false });
      helpers.setErrors({ Submit: err.response.data.message });
      helpers.setSubmitting(false);
      router.push(familyMembersPageRoute);
    }
  };

  return <Form title="Add Family Member" actionName="Add" fields={fields} onSubmit={onSubmit} />;
}

export { AddFamilyMemberNoAccountInfo };
