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

exports.getDoctorByEmail = async (doctorEmail) => {
  const doctor = await Doctor.findOne({ email: doctorEmail });
  return doctor;
};

exports.getDoctorApplications = async () => {
  const doctors = await Doctor.find({ status: "pending" });
  return doctors;
};

exports.createDoctor = async (doctorData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(doctorData.password, salt);
  const doctor = new Doctor({
    ...doctorData,
    password: hashedPassword,
  });
  await doctor.save();
  return doctor;
};

exports.updateDoctor = async (doctorUsername, doctorData) => {
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: doctorData },
    { new: true }
  );
  return doctor;
};

exports.updateDoctorPassword = async (doctorUsername, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const doctor = await Doctor.findOneAndUpdate(
    { username: doctorUsername },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return doctor;
};

exports.deleteDoctor = async (doctorUsername) => {
  const deletedDoctor = await Doctor.findOneAndDelete({
    username: doctorUsername,
  });
  return deletedDoctor;
};

exports.getPatients = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const patients = doctor.patients;
  return patients;
};

exports.getHealthRecords = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const healthRecords = doctor.healthRecords;
  return healthRecords;
};

exports.getChats = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const chats = doctor.chats;
  return chats;
};

exports.getNotifications = async (doctorUsername) => {
  const doctor = await this.getDoctor(doctorUsername);
  const notifications = doctor.messages;
  return notifications;
};
