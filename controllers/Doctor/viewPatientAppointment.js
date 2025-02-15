const Appointment = require("../../models/Appointment");
const { getUsername } = require("../../config/infoGetter");

exports.viewPatientAppointment = async (req, res) => {
  try {
    const { patientUsername, doctorUsername } = req.params;
    const appointments = await Appointment.find({
      doctorUsername: doctorUsername,
      patientUsername: patientUsername,
    })
      .sort({ date: 1 })
      .lean();
    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error("Error in viewPatientAppointment:", error);
    res.status(500).json({ message: error.message });
  }
};
