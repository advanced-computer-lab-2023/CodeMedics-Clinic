const Patient = require("../../models/Patient"); // Import the Patient model
const { validatePatient } = require("../../utils/validator");

exports.getPatientMessages = async (req, res) => {
  try {
    const { patientUsername } = req.params;
    const patient = await validatePatient(patientUsername, res);
    res.status(200).json({ data: patient.messages.reverse() });
  } catch (error) {
    console.error("Error retrieving patient messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
