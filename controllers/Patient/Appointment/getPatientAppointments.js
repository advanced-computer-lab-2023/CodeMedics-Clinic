const Appointment = require("../../../models/Appointment");

exports.getPatientAppointments = async (req, res) => {
  const { patientUsername } = req.params;
  const { status } = req.query;
  try {
    const query = { patient: patientUsername };
    if (status) {
      const statusArray = Array.isArray(status) ? status : status.split(",");
      query.status = { $in: statusArray };
    }
    let appointments = await Appointment.find({ query })
      .sort({ date: 1 })
      .lean();
    console.log("appointments", appointments);
    if (status) {
      appointments = appointments.filter((item) =>
        status.includes(item.status)
      );
    }

    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
