const Appointment = require("../../models/Appointment");
const ClinicWallet = require("../../models/ClinicWallet");
const {
  handlePatientAppointmentNotification,
  handleDoctorAppointmentNotification,
  sendNotification,
} = require("../../utils/notificationHandler");

exports.validateAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  return appointment;
};

exports.getAppointments = async (query = {}) => {
  const appointments = await Appointment.find(query);
  return appointments;
};

exports.checkExistingAppointmentWithQuery = async (query) => {
  const appointment = await Appointment.findOne(query);
  return appointment ? true : false;
};

exports.getAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointment);
  return appointment;
};

exports.createAppointment = async (appointmentData) => {
  const appointment = new Appointment(appointmentData);
  await appointment.save();
  return appointment;
};

exports.updateAppointment = async (appointmentId, appointmentData) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    appointmentData,
    {
      new: true,
    }
  );
  return appointment;
};

exports.completeAppointment = async (appointmentId) => {
  return await this.updateAppointment(appointmentId, {
    status: "completed",
  });
};

exports.cancelAppointment = async (appointmentId) => {
  return await this.updateAppointment(appointmentId, {
    status: "cancelled",
  });
};

exports.handleAppointmentCancellation = async (
  appointmentId,
  patient,
  doctor,
  package
) => {
  const appointment = await this.validateAppointment(appointmentId);
  const clinicWallet = await ClinicWallet.findOne();
  let discount = 0;
  if (package) {
    discount = package.sessionDiscount;
  }
  const clinicFees = doctor.hourlyRate * 0.1;
  const hours = Math.abs(
    parseInt(appointment.startHour) - parseInt(appointment.endHour)
  );
  const appointmentPrice = hours * (doctor.hourlyRate + clinicFees);
  doctor.wallet -= hours * doctor.hourlyRate;
  patient.wallet += appointmentPrice - (appointmentPrice * discount) / 100;
  clinicWallet.wallet -= clinicFees;
  appointment.status = "cancelled";
  await clinicWallet.save();
  await doctor.save();
  await patient.save();
  await appointment.save();
  const notificationMessage = `Your appointment on ${appointment.date} has been canceled.`;

  await sendNotification(
    doctor,
    "Appointment Cancelled",
    notificationMessage,
    notificationMessage
  );

  await sendNotification(
    patient,
    "Appointment Cancelled",
    notificationMessage,
    notificationMessage
  );
};

exports.deleteAppointment = async (appointmentId) => {
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  return appointment;
};

exports.addEmptyAppointment = async (doctorUsername, bodyData) => {
  const date = bodyData.date.split("T")[0];
  const startHour = bodyData.startHour.substring(0, 2);
  const endHour = bodyData.endHour.substring(0, 2);
  const appointment = new Appointment({
    doctorUsername,
    patientUsername: null,
    date: date,
    startHour: startHour,
    endHour: endHour,
    status: "unreserved",
  });
  await appointment.save();
  return appointment;
};

exports.addAppointment = async (appointment, patient, doctor, price = 0) => {
  appointment.patientUsername = patient.username;
  appointment.status = "upcoming";
  await appointment.save();
  patient.wallet -= price;
  doctor.wallet += price;
  doctor.patients.push(patient.username);
  await patient.save();
  await doctor.save();
  handlePatientAppointmentNotification(patient, appointment, doctor);
  handleDoctorAppointmentNotification(doctor, patient, appointment);
};

exports.payAppointment = async (
  patient,
  doctor,
  appointmentId,
  paymentMethod
) => {
  const appointment = await this.validateAppointment(appointmentId);
  if (paymentMethod === "wallet") {
    await payWithWallet(p, appointment);
  } else if (paymentMethod === "creditCard") {
    appointment.status = "upcoming";
    appointment.patientUsername = patientUsername;
    await appointment.save();
  } else {
    const error = new Error("Invalid payment method");
    error.statusCode = 400;
    throw error;
  }
};
