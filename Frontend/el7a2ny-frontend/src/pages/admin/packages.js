import { Button, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import { useState } from "react";
import Message from "src/components/Miscellaneous/Message";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import PopUp from "src/components/Miscellaneous/PopUp";
import { DELETE, PATCH, POST } from "src/project-utils/helper-functions";
import ObjectDetails from "src/components/Account/ObjectDetails";
import { Table } from "src/components/Table/Table";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import CardObject from "src/components/CardObject/CardObject";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [obj, setObj] = useState(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [displayPopUp, setDisplayPopUp] = useState(false);

  useGet({
    url: `${BACKEND_ROUTE}/admins/packages`,
    setData,
    setLoading,
    setShowError,
    setError,
  });

  const fields = [
    {
      name: "name",
      label: "Package Name",
      type: "text",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
    },
    {
      name: "sessionDiscount",
      label: "Session Discount Precentage",
      type: "number",
    },
    {
      name: "familyDiscount",
      label: "Family Discount Precentage",
      type: "number",
    },
    {
      name: "medicineDiscount",
      label: "Medicine Discount Precentage",
      type: "number",
    },
  ];

  const addPackage = async (body) => {
    POST({
      url: `${BACKEND_ROUTE}/admins/packages`,
      body,
      setShowError,
      setError,
      updater: () => {
        window.location.reload();
      },
    });
  };
  const updatePackage = async (body) => {
    PATCH({
      url: `${BACKEND_ROUTE}/admins/packages/${body.name}`,
      body,
      setShowError,
      setError,
      updater: () => {
        setData((prev) =>
          prev.map((item) => {
            if (item.name == body.name) {
              return body;
            }
            return item;
          })
        );
        setDisplayPopUp(false);
      },
    });
  };
  const removePackage = async (item) => {
    DELETE({
      url: `${BACKEND_ROUTE}/admins/packages/${item.name}`,
      setShowError,
      setError,
      updater: () => {
        setData((prev) => prev.filter((e) => e.name != item.name));
      },
    });
  };

  const tableRows = data.map((item) => (
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
      cardActionsElement={
        <CardActionsElement
          actions={[
            {
              name: "Update",
              onClick: () => {
                setObj(item);
                setDisplayPopUp(true);
              },
            },
            {
              name: "Delete",
              onClick: () => {
                removePackage(item);
              },
            },
          ]}
        />
      }
    />
  ));

  const tableActions = (
    <Button
      color="inherit"
      startIcon={
        <SvgIcon fontSize="small">
          <ArrowUpOnSquareIcon />
        </SvgIcon>
      }
      onClick={() => setDisplayPopUp(true)}
    >
      Add Package
    </Button>
  );

  return (
    <>
      <Table
        value={{
          data,
          loading,
          setShowError,
          setError,
          setLoading,
          noRecords: "No Packages Found",
          tableRows,
          displayGrid: "true",
          px: 250,
        }}
        title="Packages"
        actions={tableActions}
      />
      <PopUp title="Add Package" viewing={displayPopUp} setViewing={setDisplayPopUp}>
        <ObjectDetails
          obj={obj}
          fields={fields}
          setError={setError}
          setShowError={setShowError}
          action={(body) => {
            if (obj) {
              updatePackage(body);
            } else {
              addPackage(body);
            }
          }}
        />
      </PopUp>
      <Message
        condition={showError}
        setCondition={setShowError}
        title="Error"
        message={error}
        action="Close"
      />
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
