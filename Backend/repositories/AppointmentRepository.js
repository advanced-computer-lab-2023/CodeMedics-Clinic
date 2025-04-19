const Appointment = require("../../models/Appointment");
const {
  handlePatientAppointmentNotification,
  handleDoctorAppointmentNotification,
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

exports.cancelAppointment = async (appointmentId) => {
  return await this.updateAppointment(appointmentId, {
    status: "cancelled",
  });
};

exports.deleteAppointment = async (appointmentId) => {
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  return appointment;
};

exports.addAppointment = async (appointment, patient, doctor, price = 0) => {
  appointment.patientUsername = patient.username;
  appointment.status = "upcoming";
  await appointment.save();
  patient.wallet -= price;
  doctor.wallet += price;
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
