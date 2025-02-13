const { validatePatient } = require("../../utils/validator");

exports.viewHealthRecords = async (req, res) => {
  try {
    const { patientUsername } = req.params;
    const patient = await validatePatient(patientUsername, res);
    const healthRecords = patient.healthRecords;
    res.status(200).json({ data: healthRecords });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: e.message });
  }
};
