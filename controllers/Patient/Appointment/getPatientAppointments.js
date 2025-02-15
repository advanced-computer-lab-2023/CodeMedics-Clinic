const Appointment = require("../../../models/Appointment");

exports.getPatientAppointments = async (req, res) => {
  const { patientUsername } = req.params;
  const { status } = req.query;

  try {
    const query = { patientUsername };

    if (status) {
      const statusArray = Array.isArray(status) ? status : status.split(",");
      query.status = { $in: statusArray };
    }
    const appointments = await Appointment.find({patientUsername}).sort({ date: 1 }).lean();
    console.log("apps", appointments);
    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};