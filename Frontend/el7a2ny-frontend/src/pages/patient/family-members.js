import Head from "next/head";
import { Box, Container, Button, Stack } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Message from "src/components/Miscellaneous/Message";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Cookies from "js-cookie";
import { useGet } from "src/hooks/custom-hooks";
import CardObject from "src/components/CardObject/CardObject";
import CardActionsElement from "src/components/CardObject/CardActionsElement";
import { Table } from "src/components/Table/Table";
import { DELETE } from "src/project-utils/helper-functions";

const Page = () => {
  const router = useRouter();

  const [data, setData] = useState({ familyMembers: [], familyMembersNoAccount: [] });
  const familyMembers = data.familyMembers;
  const familyMembersNoAccount = data.familyMembersNoAccount;
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const username = Cookies.get("username");

  useGet({
    url: `${BACKEND_ROUTE}/patients/${username}/family-members`,
    setData,
    setLoading,
    setShowError,
    setError,
  });

  console.log("My family: ", data);

  const addFamilyMemberRedirect = () => {
    router.push("/patient/add-family-member");
  };

  const addFamilyMemberNoAccountRedirect = () => {
    router.push("/patient/add-family-member-no-account");
  };

  const removeFamilyMember = (familyMemberUsername) => {
    DELETE({
      url: `${BACKEND_ROUTE}/patients/${username}/family-members`,
      body: { familyMemberUsername },
      setShowError,
      setError,
      updater: () => {
        setData((prev) => ({
          ...prev,
          familyMembers: prev.familyMembers.filter((item) => item.username != familyMemberUsername),
        }));
      },
    });
  };

  const removeFamilyMemberNoAccount = (familyMemberId) => {
    DELETE({
      url: `${BACKEND_ROUTE}/patients/${username}/family-members-no-account`,
      body: { familyMemberId },
      setShowError,
      setError,
      updater: () => {
        setData((prev) => ({
          ...prev,
          familyMembersNoAccount: prev.familyMembersNoAccount.filter(
            (item) => item._id != familyMemberId
          ),
        }));
      },
    });
  };

  const actions = familyMembers.map((item) => [
    {
      name: "Remove",
      onClick: () => removeFamilyMember(item.username),
    },
  ]);
  const tableRows = familyMembers.map((item, index) => (
    <CardObject
      item={item}
      index={index}
      texts={[`${item.firstName} ${item.lastName}`]}
      variants={["subtitle1"]}
      cardActionsElement={<CardActionsElement actions={actions[index]} />}
    />
  ));
  for (let i = 0; i < familyMembersNoAccount.length; i++) {
    const curActions = [
      { name: "Remove", onClick: () => removeFamilyMemberNoAccount(familyMembersNoAccount[i]._id) },
    ];
    tableRows.push(
      <CardObject
        item={familyMembersNoAccount[i]}
        index={i}
        texts={[`${familyMembersNoAccount[i].name}`]}
        variants={["subtitle1"]}
        cardActionsElement={<CardActionsElement actions={curActions} />}
      />
    );
  }

  return (
    <>
      <Head>
        <title>El7a2ny Clinic</title>
      </Head>
      <Message
        condition={showError}
        setCondition={setShowError}
        title="Error"
        message={error}
        buttonAction="Close"
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row">
            <Button onClick={addFamilyMemberNoAccountRedirect} sx={{ marginLeft: "auto" }}>
              Add Family Member
            </Button>
            <Button onClick={addFamilyMemberRedirect} sx={{ marginLeft: "0" }}>
              Add existing user as Family Member
            </Button>
          </Stack>
          <Table
            title="Family Members"
            value={{
              loading,
              setShowError,
              setError,
              setLoading,
              noRecords: "No Family Members Found",
              tableRows,
              displayGrid: "true",
              px: 250,
            }}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
