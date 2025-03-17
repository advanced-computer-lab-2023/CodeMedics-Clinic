const Patient = require("../../models/Doctor");
const { validatePatient } = require("../../utils/validator");
const removePatient = async (req, res) => {
  const { patientUsername } = req.params;
  const patient = await validatePatient(patientUsername, res);
  await Patient.deleteOne({ username: patientUsername });
  return res.status(201).json({ message: "Patient removed." });
};

module.exports = removePatient;
