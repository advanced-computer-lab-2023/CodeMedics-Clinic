const portNumber = 8000;
const backendRoute = `http://localhost:${portNumber}`;
const patientPrescriptionRoute = `${backendRoute}/patient/prescriptions`;
const patientAppointmentRoute = `${backendRoute}/patient/getAllFamilyAppointments`;
const familyMembersRoute = `${backendRoute}/patient/familyMembers`;
const freeSlotsRoute = `${backendRoute}/patient/getFreeSlotsOfDoctor`;
const followUpRequestRoute = `${backendRoute}/patient/RequestFollowUp`;
const appointmentRescheduleRoute = `${backendRoute}/patient/RescheduleAppointment`;
const appointmentCancellationRoute = `${backendRoute}/patient/CancelAppointment`;
const patientUpdateRoute = `${backendRoute}/patient/updateMe`
const patientRoute = `${backendRoute}/patient/getMe`
export {
  patientPrescriptionRoute,
  patientAppointmentRoute,
  familyMembersRoute,
  freeSlotsRoute,
  followUpRequestRoute,
  appointmentRescheduleRoute,
  appointmentCancellationRoute,
  patientUpdateRoute,
  patientRoute
};
