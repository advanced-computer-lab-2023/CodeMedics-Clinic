import React, { useState } from "react";
import { TableRow, TableCell, Stack } from "@mui/material";
import Icon from "src/components/Icon";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ObjectInfo from "src/components/ObjectInfo";
import ReschedulePopUp from "src/components/ReschedulePopUp";
import { BACKEND_ROUTE } from "src/utils/Constants";
import Cookies from "js-cookie";

const FollowUpRow = ({ item, reject }) => {
  const username = Cookies.get("username");
  const [scheduling, setScheduling] = useState(false);
  const [popUpDataLoading, setPopUpDataLoading] = useState(true);

  return (
    <>
      <TableRow key={item._id}>
        <ObjectInfo obj={item} attributes={["patientUsername", "date", "startHour", "endHour"]} />
        <TableCell>
          <Stack direction="row" spacing={2}>
            <Icon title="Accept Follow-up" onClick={() => setScheduling(true)}>
              <CheckIcon />
            </Icon>
            <Icon title="Reject Follow-up" onClick={() => reject(item)}>
              <XMarkIcon />
            </Icon>
          </Stack>
        </TableCell>
      </TableRow>
      <ReschedulePopUp
        loading={popUpDataLoading}
        setLoading={setPopUpDataLoading}
        rescheduling={scheduling}
        setRescheduling={setScheduling}
        getUrl={`${BACKEND_ROUTE}/doctors/${username}/appointments`}
        patchUrl={`${BACKEND_ROUTE}/doctors/appointments`}
        appointment={item}
        followUp={true}
      />
    </>
  );
};

export default FollowUpRow;
