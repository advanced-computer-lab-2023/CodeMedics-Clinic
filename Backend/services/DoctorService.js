const doctorRepo = require("../repositories/DoctorRepository");
const patientRepo = require("../repositories/PatientRepository");
const appointmentRepo = require("../repositories/AppointmentRepository");
const prescriptionRepo = require("../repositories/PrescriptionRepository");
const packageRepo = require("../repositories/PackageRepository");
const { sendNotification } = require("../../utils/notificationHandler");

exports.getDoctor = async (doctorUsername) => {
  const doctor = await doctorRepo.validateDoctor(doctorUsername);
  return doctor;
};

exports.getDoctors = async () => {
  const doctors = await doctorRepo.getDoctors();
  return doctors;
};

exports.createDoctor = async (doctorData) => {
  // TODO: fix later
  const doctor = await doctorRepo.createDoctor(doctorData);
  return doctor;
};

exports.updateDoctor = async (doctorUsername, doctorData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const doctor = await doctorRepo.updateDoctor(doctorUsername, doctorData);
  return doctor;
};

exports.updateDoctorPassword = async (doctorUsername, password) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const doctor = await doctorRepo.updateDoctorPassword(
    doctorUsername,
    password
  );
  return doctor;
};

exports.getPatients = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const patientsUsernames = await doctorRepo.getPatients(doctorUsername);
  const patients = [];
  for (const patientUsername of patientsUsernames) {
    const patient = await patientRepo.validatePatient(patientUsername);
    const yes = await appointmentRepo.checkExistingAppointmentWithQuery({
      patientUsername,
      doctorUsername,
      status: "upcoming",
    });
    patients.push({ patient, upcoming: yes });
  }
  return patients;
};

exports.getAppointments = async (doctorUsername, status) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const query = { doctorUsername };
  if (status) {
    const statusArray = Array.isArray(status) ? status : status.split(",");
    query.status = { $in: statusArray };
  }
  const appointments = await appointmentRepo.getAppointments(query);
  return appointments;
};

exports.addAppointment = async (doctorUsername, bodyData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.addEmptyAppointment(
    doctorUsername,
    bodyData
  );
  return appointment;
};

exports.updateAppointment = async (doctorUsername, appointmentId, bodyData) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.updateAppointment(
    appointmentId,
    bodyData
  );
  return appointment;
};

exports.completeAppointment = async (doctorUsername, appointmentId) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.completeAppointment(appointmentId);
  return appointment;
};

exports.cancelAppointment = async (doctorUsername, appointmentId) => {
  const doctor = await doctorRepo.validateDoctor(doctorUsername);
  const appointment = await appointmentRepo.validateAppointment(appointmentId);
  if (
    appointment.status === "completed" ||
    appointment.status === "unreserved"
  ) {
    const error = new Error("Cannot cancel this appointment");
    error.statusCode = 400;
    throw error;
  }
  const patient = await patientRepo.validatePatient(
    appointment.patientUsername
  );
  const package = await packageRepo.validatePackage(patient.healthPackage.name);
  const updatedAppointment = await appointmentRepo.cancelAppointment(
    appointmentId
  );
  await appointmentRepo.handleAppointmentCancellation(
    appointmentId,
    patient,
    doctor,
    package
  );
  return updatedAppointment;
};

exports.getPrescriptions = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const prescriptions = await prescriptionRepo.getPrescriptions({
    doctorUsername,
  });
  return prescriptions;
};

exports.getHealthRecords = async (doctorUsername, patientUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const healthRecords = await patientRepo.getHealthRecords(patientUsername);
  return healthRecords;
};

exports.addHealthRecord = async (
  doctorUsername,
  patientUsername,
  fileData,
  bodyData
) => {
  await doctorRepo.validateDoctor(doctorUsername);
  await patientRepo.validatePatient(patientUsername);
  const healthRecord = await patientRepo.addHealthRecord(
    patientUsername,
    fileData,
    bodyData
  );
  return healthRecord;
};

exports.getNotifications = async (doctorUsername) => {
  await doctorRepo.validateDoctor(doctorUsername);
  const notifications = await doctorRepo.getNotifications(doctorUsername);
  return notifications;
};
