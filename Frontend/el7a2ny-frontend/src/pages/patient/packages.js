import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import Message from "src/components/Miscellaneous/Message";
import LoadingSpinner from "src/components/LoadingSpinner";
import { BACKEND_ROUTE } from "src/utils/Constants";
import Cookies from "js-cookie";
import { useGet } from "src/hooks/custom-hooks";
import Title from "src/components/Table/Body/Title";
import Form from "src/components/Form";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import { DELETE } from "src/project-utils/helper-functions";
import { Table } from "src/components/Table/Table";
import { useRouter } from "next/router";

const Page = () => {
  const [packages, setPackages] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const username = Cookies.get("username");

  const values = patient
    ? {
        healthPackageName: patient.healthPackage.name,
        healthPackageExpirationDate:
          patient.healthPackage.date == null
            ? "No Expiration"
            : new Date(patient.healthPackage.date).toDateString(),
        healthPackageStatus:
          patient.healthPackage.status == "EndDateCancelled"
            ? "Cancelled with end date"
            : patient.healthPackage.status == "Inactive"
            ? "Free Package Active"
            : "Active",
        healthPackageType: patient.healthPackage.status == "main" ? "Main" : "Family",
      }
    : null;

  const fields = [
    {
      name: "healthPackageName",
      label: "Health Package Name",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageExpirationDate",
      label: "Health Package Expiration Date",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageStatus",
      label: "Health Package Status",
      type: "text",
      disabled: true,
    },
    {
      name: "healthPackageType",
      label: "Health Package Type",
      type: "text",
      disabled: true,
    },
  ];

  useGet({
    url: `${BACKEND_ROUTE}/patients/packages`,
    setData: setPackages,
    setShowError,
    setError,
  });

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}`,
    setData: setPatient,
    setShowError,
    setError,
    setLoading,
  });

  const subscribeHealthPackage = (packageName) => {
    router.push(`/patient/payment?packageName=${packageName}&patientUsername=${patient.username}`);
  };

  const unsubscribeHealthPackage = () => {
    DELETE({
      url: `${BACKEND_ROUTE}/patients/${username}/health-packages/subscription`,
      updater: () => {
        setPatient((prev) => ({
          ...prev,
          healthPackage: {
            name: "Free",
            price: 0,
            discount: 0,
            status: "Inactive",
            date: null,
            discountEndDate: null,
          },
        }));
      },
      setShowError,
      setError,
    });
  };

  const actions = packages.map((item) => [
    {
      name: "Add",
      disabled: !(patient && patient.healthPackage.name == "Free"),
      onClick: () => subscribeHealthPackage(item.name),
    },
    {
      name: "Delete",
      disabled: !(patient && item.name == patient.healthPackage.name),
      onClick: () => unsubscribeHealthPackage(),
    },
  ]);

  const tableRows = packages.map((item, index) => (
    <CardObject
      item={{ src: `/assets/Packages/${item.name}.jpg` }}
      texts={[
        `${item.price} EGP / Yr`,
        `${item.name} Package`,
        `${item.sessionDiscount}% Session Discount`,
        `${item.medicineDiscount}% Medicine Discount`,
        `${item.familyDiscount}% Family Discount`,
      ]}
      variants={["h5", "subtitle2", "subtitle1", "subtitle1", "subtitle1"]}
      cardActionsElement={<CardActionsElement actions={actions[index]} />}
    />
  ));

  return (
    <>
      <Title title="El7a2ny Clinic" />
      <Message
        condition={showError}
        setCondition={setShowError}
        title={"Error"}
        message={error}
        buttonAction={"Close"}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Form title="Current Health Package" values={values} fields={fields} largeTitle="true" />
          <Table
            value={{
              setLoading,
              loading,
              setShowError,
              setError,
              noRecords: "No Packages Found",
              tableRows,
              displayGrid: "true",
              px: 250,
            }}
            title="Packages"
          />
        </>
      )}
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
