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
import { PATCH } from "src/project-utils/helper-functions";
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
}) {
  const { setShowError, setError, setAllData, setPopUpDisplay, setPopUpElement } =
    useContext(TableContext);
  const [unreservedAppointments, setUnreservedAppointments] = useState([]);
  const unreservedAppointmentsElements = unreservedAppointments.map((item) => {
    return (
      <Row key={item._id}>
        <ObjectInfo obj={item} attributes={attributes} />
        <Cell>
          <ButtonElement
            actionName="Reschedule"
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
      title={"Reschedule Appointment"}
      viewing={rescheduling}
      setViewing={setRescheduling}
      actionName="Close"
      setPopUpDisplay={setPopUpDisplay}
    >
      {loading ? (
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
    if (oldApp) {
      PATCH({
        url: `${patchUrl}/${newApp._id}`,
        body: { status: "rescheduled", patientUsername: oldApp.patientUsername },
        setShowError,
        setError,
      });
    }

    PATCH({
      url: `${patchUrl}/${oldApp._id}`,
      body: { status: "unresrved", patientUsername: null },
      setShowError,
      setError,
      updater: () => {
        setAllData((prev) =>
          prev.map((item) => {
            if (oldApp) {
              if (item._id !== oldApp._id && item._id != newApp._id) return item;
              if (item._id == oldApp._id) {
                return {
                  ...item,
                  _id: newApp._id,
                  status: "rescheduled",
                  patientUsername: oldApp.patientUsername,
                };
              }
              return { ...item, _id: oldApp._id, status: "unreserved", patientUsername: null };
            } else {
              if (item._id != newApp._id) return item;
              return { ...item, status: "upcoming", patientUsername: patient.username };
            }
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
  }, [rescheduling, loading]);

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
