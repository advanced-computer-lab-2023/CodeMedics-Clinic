import { useState } from "react";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Form from "../Form";
import { PATCH } from "src/project-utils/helper-functions";
import Cookies from "js-cookie";

function AccountDetails({ user, fields, setShowError, setError }) {
  const createInitialValues = () => {
    const initialValues = {};
    fields.forEach((field) => {
      if (field.name.includes(".")) {
        const [parent, child] = field.name.split(".");
        initialValues[field.name] = user[parent]?.[child] || "";
      } else {
        initialValues[field.name] = user[field.name] || "";
      }
    });
    return initialValues;
  };

  const [formValues, setFormValues] = useState(createInitialValues());

  const formFields = fields.map((field) => ({
    ...field,
    value: formValues[field.name],
    setValue: (value) => {
      setFormValues((prev) => ({
        ...prev,
        [field.name]: value,
      }));
    },
  }));

  const onSubmit = async (submittedValues, helpers) => {
    try {
      const body = {};

      Object.keys(submittedValues).forEach((key) => {
        if (key.includes(".")) {
          const [parent, child] = key.split(".");
          if (!body[parent]) body[parent] = {};
          body[parent][child] = submittedValues[key];
        } else {
          body[key] = submittedValues[key];
        }
      });

      const apiEndpoint = `${BACKEND_ROUTE}/${Cookies.get("isDoctor") ? "doctors" : "patients"}/${
        user.username
      }`;

      PATCH({
        url: apiEndpoint,
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
      <Form
        title="Profile"
        fields={formFields}
        actionName="save"
        onSubmit={onSubmit}
        values={formValues}
      />
    </div>
  );
}

export default AccountDetails;
