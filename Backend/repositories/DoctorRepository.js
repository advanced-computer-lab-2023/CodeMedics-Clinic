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

exports.getDoctors = async () => {
  const doctors = await Doctor.find({});
  return doctors;
};

exports.getDoctor = async (doctorUsername) => {
  const doctor = await Doctor.findOne({ username: doctorUsername });
  return doctor;
};
