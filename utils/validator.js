const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const validateAppointment = async (appointmentId, res) => {
  const appointment = await Appointment.findOne({ _id: appointmentId });
  if (!appointment) {
    res.status(400).json({ message: "Appointment not found" });
  }
  return appointment;
};

const validatePatient = async (patientUsername, res) => {
  const patient = await Patient.findOne({ username: patientUsername });
  if (!patient) {
    res.status(400).json({ message: "Patient not found" });
  }
  return patient;
};

const validateDoctor = async (doctorUsername, res) => {
  const doctor = await Doctor.findOne({ username: doctorUsername });
  if (!doctor) {
    res.status(400).json({ message: "Doctor not found" });
  }
  return doctor;
};

module.exports = { validateAppointment, validatePatient, validateDoctor };
