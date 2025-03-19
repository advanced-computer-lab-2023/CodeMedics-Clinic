import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_ROUTE } from "src/project-utils/constants";
import Icon from "src/components/Icon";
import { PATCH } from "src/project-utils/helper-functions";
import CancelIcon from "src/icons/untitled-ui/duocolor/CancelIcon";
import { CheckIcon } from "@heroicons/react/24/solid";
import RescheduleIcon from "src/icons/untitled-ui/duocolor/RescheduleIcon";
import ReschedulePopUp from "src/components/ReschedulePopUp";
import { TableContext } from "../Table/Table";
function DoctorAppointmentActions({ item }) {
  const [popUpDataLoading, setPopUpDataLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const { setShowError, setError, setPopUpDisplay, setPopUpElement, setAllData } =
    useContext(TableContext);
  const username = Cookies.get("username");

  function updateAppointment(appointmentId, status) {
    PATCH({
      url: `${BACKEND_ROUTE}/doctors/appointments/${appointmentId}/${
        status == "cancelled" ? "cancel" : "complete"
      }`,
      body: { status },
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (item._id == appointmentId) {
              return { ...item, status: status };
            }
            return item;
          })
        );
      },
      setShowError,
      setError,
    });
  }

  useEffect(() => {
    if (rescheduling) {
      const popUp = (
        <ReschedulePopUp
          loading={popUpDataLoading}
          setLoading={setPopUpDataLoading}
          rescheduling={rescheduling}
          setRescheduling={setRescheduling}
          getUrl={`${BACKEND_ROUTE}/doctors/${username}/appointments`}
          patchUrl={`${BACKEND_ROUTE}/doctors/appointments`}
          appointment={item}
        />
      );
      
      setPopUpElement(popUp);
      setPopUpDisplay(true);
    }
  }, [rescheduling]);

  return (
    <>
      <Icon
        disabled={!(item.status == "upcoming" || item.status == "rescheduled")}
        title="Complete Appointment"
        onClick={() => {
          updateAppointment(item._id, "completed");
        }}
      >
        <CheckIcon />
      </Icon>
      <Icon
        disabled={!(item.status == "upcoming" || item.status == "rescheduled")}
        title="Reschedule Appointment"
        onClick={() => {
          setRescheduling(true);
        }}
      >
        <RescheduleIcon />
      </Icon>
      <Icon
        disabled={!(item.status == "upcoming" || item.status == "rescheduled")}
        title="Cancel Appointment"
        onClick={() => {
          updateAppointment(item._id, "cancelled");
        }}
      >
        <CancelIcon disabled={!(item.status == "upcoming" || item.status == "rescheduled")} />
      </Icon>
    </>
  );
}

export default DoctorAppointmentActions;
