const Appointment = require('../../../models/Appointment');

exports.getPatientAppointments = async (req, res) => {
  const { patientUsername } = req.params;
  const {status} = req.query
  try {
    const appointments = await Appointment.find({
      patient: patientUsername,
      status: { $in: status }
    }).sort({ date: 1 }).lean();
    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
