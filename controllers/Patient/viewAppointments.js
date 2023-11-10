const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.viewUpcomingAppointments = async (req, res) => {
  const { patientUsername } = req.params;

  try {
    const currentDate = new Date().toISOString(); // Use UTC format

    const upcomingAppointments = await Appointment.find({
      patient: patientUsername,
      status: { $in: ['upcoming','rescheduled'] }
    }).sort({ date: 1 }).lean();

    res.status(200).json({ upcomingAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.viewPastAppointments = async (req, res) => {
    try {
        const { patientUsername } = req.params;

        const pastAppointments = await Appointment.find({
            patient: patientUsername,
            status: { $in: ['completed', 'cancelled'] }
        }).lean();

        res.status(200).json({ pastAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
