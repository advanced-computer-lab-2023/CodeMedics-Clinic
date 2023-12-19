const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');


exports.viewPatientAppointment = async (req, res) => {
  try {
    const { patientUsername } = req.params;
    const doctorUsername = await getUsername(req, res);
    const upcomingAppointments = await Appointment.find({
      doctorUsername: doctorUsername,
      patient: patientUsername,
    }).sort({ date: 1 }).lean();
    res.status(200).json({ upcomingAppointments });
  } catch (error) {
    console.error('Error in viewPatientAppointment:', error);
    res.status(500).json({ message: error.message });
  }
};
