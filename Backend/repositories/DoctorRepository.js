const bcrypt = require("bcryptjs");
const Doctor = require("../../models/Doctor");

exports.validateDoctor = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

exports.getDoctors = async (query = {}) => {
  const doctors = await Doctor.find(query);
  return doctors;
};

exports.getDoctor = async (doctorUsername) => {
  const doctor = await Doctor.findOne({ username: doctorUsername });
  return doctor;
};

exports.createDoctor = async (doctorData) => {
  // TODO: fix later
  const doctor = await Doctor.create(doctorData);
  return doctor;
};

exports.updateDoctor = async (doctorUsername, doctorData) => {
  await this.validateDoctor(doctorUsername);
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: doctorData },
    { new: true }
  );
  return doctor;
};

exports.updateDoctorPassword = async (doctorUsername, password) => {
  await this.validateDoctor(doctorUsername);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return doctor;
};

exports.getPatients = async (doctorUsername) => {
  const doctor = await this.validateDoctor(doctorUsername);
  const patients = doctor.patients
  return patients;
};

exports.getHealthRecords = async (doctorUsername) => {
  const doctor = await this.validateDoctor(doctorUsername);
  const healthRecords = doctor.healthRecords;
  return healthRecords;
};

exports.getNotifications = async (doctorUsername) => {
  const doctor = await this.validateDoctor(doctorUsername);
  const notifications = doctor.messages;
  return notifications;
}

