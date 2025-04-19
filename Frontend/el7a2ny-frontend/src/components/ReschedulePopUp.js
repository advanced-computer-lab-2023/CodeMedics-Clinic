import { useContext, useEffect, useState } from "react";
import { Table, TableBody } from "@mui/material";
import { TableContext } from "./Table/Table";
import LoadingSpinner from "./LoadingSpinner";
import PopUp from "./Miscellaneous/PopUp";
import Head from "./Table/Body/Head";
import ButtonElement from "./ButtonElement";
import Cell from "./Table/BasicElements/Cell";
import Row from "./Table/BasicElements/Row";
import { useGet } from "src/hooks/custom-hooks";
import { DELETE, PATCH } from "src/utils/helper-functions";
import ObjectInfo from "./ObjectInfo";
const attributes = ["date", "day", "startHour", "endHour"];

function ReschedulePopUp({
  getUrl,
  patchUrl,
  loading,
  setLoading,
  rescheduling,
  setRescheduling,
  appointment,
  patient,
  followUp,
  scheduleFollowUp,
}) {
  const { setShowError, setError, setAllData, setPopUpDisplay, setPopUpElement, allData, reject } =
    useContext(TableContext);
  const [unreservedAppointments, setUnreservedAppointments] = useState(
    allData ? allData.filter((item) => item.status == "unreserved") : []
  );
  const unreservedAppointmentsElements = unreservedAppointments.map((item) => {
    return (
      <Row key={item._id}>
        <ObjectInfo obj={item} attributes={attributes} />
        <Cell>
          <ButtonElement
            actionName="Schedule"
            onClick={() => {
              hanldeRescheduleAppointment(item, appointment);
              setRescheduling(false);
              setPopUpDisplay(false);
            }}
          />
        </Cell>
      </Row>
    );
  });

  const reschedulePopUp = (
    <PopUp
      title={"Schedule Appointment"}
      viewing={rescheduling}
      setViewing={setRescheduling}
      actionName="Close"
      setPopUpDisplay={setPopUpDisplay}
    >
      {loading && !allData ? (
        <LoadingSpinner />
      ) : (
        <Table>
          {unreservedAppointments.length ? (
            <>
              <Head columns={["Date", "Day", "From", "To"]} />
              <TableBody>{unreservedAppointmentsElements}</TableBody>
            </>
          ) : (
            <Row>
              <Cell>Sorry, No Available Slots!</Cell>
            </Row>
          )}
        </Table>
      )}
    </PopUp>
  );

  async function hanldeRescheduleAppointment(newApp, oldApp) {
    if (scheduleFollowUp) {
      PATCH({
        url: `${patchUrl}/${newApp._id}`,
        body: { status: "upcoming", patientUsername: patient.username },
        updater: () => {
          setAllData((prev) =>
            prev.map((item) => {
              if (item._id == newApp._id) {
                return { ...item, status: "upcoming", patientUsername: patient.username };
              }
              return item;
            })
          );
        },
        setShowError,
        setError,
      });
      return;
    }
    if (oldApp) {
      if (followUp) {
        reject(oldApp);
      } else
        PATCH({
          url: `${patchUrl}/${newApp._id}`,
          body: { status: "rescheduled", patientUsername: oldApp.patientUsername },
          setShowError,
          setError,
        });
    }

    PATCH({
      url: `${patchUrl}/${oldApp._id}`,
      body: { status: "unreserved", patientUsername: null },
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) =>
          prev
            .map((item) => {
              if (oldApp) {
                if (item._id !== oldApp._id && item._id != newApp._id) return item;
                if (item._id == oldApp._id) {
                  return {
                    ...item,
                    status: "unreserved",
                    patientUsername: null,
                  };
                }
                return {
                  ...item,
                  status: "rescheduled",
                  patientUsername: oldApp.patientUsername,
                };
              } else {
                if (item._id != newApp._id) return item;
                return { ...item, status: "upcoming", patientUsername: patient.username };
              }
            })
            .filter((item) => {
              if (!followUp) return true;
              return item._id != oldApp._id && item._id != newApp._id;
            })
        );
      },
    });
  }

  useEffect(() => {
    if (rescheduling) {
      setPopUpDisplay(true);
      setPopUpElement(reschedulePopUp);
    }
  }, [rescheduling, loading, allData]);

  if (!allData)
    useGet({
      url: `${getUrl}?status=unreserved`,
      setData: setUnreservedAppointments,
      setLoading: setLoading,
      setShowError,
      setError,
      dependency: appointment ? [appointment.doctorUsername, appointment.patientUsername] : [],
    });

  return <> </>;
}

export default ReschedulePopUp;
