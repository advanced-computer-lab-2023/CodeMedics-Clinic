const Doctor = require("../../models/Doctor");
const Patient = require("../../models/Patient");
const Appointment = require("../../models/Appointment");
const { getUsername } = require("../../config/infoGetter");
const { validateDoctor } = require("../../utils/validator");

exports.viewPatients = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const doctor = await validateDoctor(doctorUsername, res);
    const patients = [];
    if (doctor.patients == null) return res.status(200).json({ patients });
    for (var i = 0; i < doctor.patients.length; i++) {
      const patient = await Patient.findOne({ _id: doctor.patients[i] });
      if (patient) {
        const appointment = await Appointment.findOne({
          patientUsername: patient.username,
          status: "upcoming",
        });
        if (appointment) {
          patients.push({ patient, upcoming: true });
        } else {
          patients.push({ patient, upcoming: false });
        }
      }
    }
    return res.status(200).json({ data: patients });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPatientByUsername = async (req, res) => {
  const username = req.query.username;
  console.log(username);
  try {
    const patient = await Patient.findOne({ Username: username });
    console.log("TESTING GetPatientByUsername", patient);
    return res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
