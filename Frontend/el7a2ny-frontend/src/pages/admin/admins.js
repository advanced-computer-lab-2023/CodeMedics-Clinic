import { useState } from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Button, Stack, SvgIcon, TableCell, TableRow } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/admin/layout";
import { useGet } from "src/hooks/custom-hooks";
import { BACKEND_ROUTE } from "src/utils/Constants";
import { DELETE, POST } from "src/project-utils/helper-functions";
import { Table } from "src/components/Table/Table";
import Message from "src/components/Miscellaneous/Message";
import ObjectInfo from "src/components/ObjectInfo";
import ButtonElement from "src/components/ButtonElement";
import PopUp from "src/components/Miscellaneous/PopUp";
import TextInput from "src/components/Inputs/TextInput";

const columns = ["username", "email", "actions"];

const Page = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [displayPopUp, setDisplayPopUp] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const filters = [
    { type: "text", name: "Search Admin Username", state: searchName, setState: setSearchName },
  ];

  function filterData() {
    return allData.filter((item) => item.username.includes(searchName));
  }

  const data = filterData();

  useGet({
    url: `${BACKEND_ROUTE}/admins`,
    setData: setAllData,
    setError,
    setShowError,
    setLoading,
  });

  const handleRemove = (adminUsername) => {
    console.log("handling", adminUsername);
    DELETE({
      url: `${BACKEND_ROUTE}/admins/${adminUsername}`,
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) => prev.filter((item) => item.username != adminUsername));
      },
    });
  };

  function addAdmin(username, password, email) {
    POST({
      url: `${BACKEND_ROUTE}/admins`,
      body: { username, email, password },
      setShowError,
      setError,
      updater: () => {
        window.location.reload();
      },
    });
  }

  const tableRows = data.map((item) => {
    return (
      <TableRow>
        <ObjectInfo obj={item} attributes={["username", "email"]} />
        <TableCell>
          <ButtonElement
            actionName="Remove"
            onClick={() => {
              console.log("removing", item, item.username);
              const adminUsername = item.username;
              handleRemove(adminUsername);
            }}
          />
        </TableCell>
      </TableRow>
    );
  });

  const tableActions = (
    <Button
      startIcon={
        <SvgIcon fontSize="small">
          <PlusIcon />
        </SvgIcon>
      }
      variant="contained"
      onClick={() => {
        setDisplayPopUp(true);
      }}
    >
      Add Admin
    </Button>
  );

  return (
    <>
      <Table
        value={{
          data,
          columns,
          loading,
          setShowError,
          setError,
          setLoading,
          noRecords: "No Admins Found",
          allData,
          setAllData,
          tableRows,
        }}
        title="Admins"
        filters={filters}
        actions={tableActions}
      />
      <Message
        title="Error"
        message={error}
        condition={showError}
        setCondition={setShowError}
        buttonAction={"Close"}
      />
      <PopUp
        title="Add Admin"
        viewing={displayPopUp}
        setViewing={setDisplayPopUp}
        actions={
          <>
            <ButtonElement
              actionName="Cancel"
              onClick={() => {
                setDisplayPopUp(false);
              }}
            />
            <ButtonElement
              actionName="Add"
              onClick={() => {
                addAdmin(username, password, email);
              }}
            />
          </>
        }
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <TextInput type="text" option="Username" defaultValue={username} setValue={setUsername} />
          <TextInput
            type="password"
            option="Password"
            defaultValue={password}
            setValue={setPassword}
          />
          <TextInput type="email" option="email" defaultValue={email} setValue={setEmail} />
        </Stack>
      </PopUp>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
