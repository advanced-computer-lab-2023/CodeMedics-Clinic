const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');


exports.viewPatientAppointment = async (req, res) => {
    try {
      const { patientUsername } = req.params;
      const doctorUsername = await getUsername(req, res);
      console.log('Doctor Username:', doctorUsername);
  
    const upcomingAppointments = await Appointment.find({
      doctorUsername: doctorUsername,
      patient: patientUsername,
      status: { $in: ['upcoming','rescheduled'] }
    }).sort({ date: 1 }).lean();

    // console.log('Upcoming Appointments:', upcomingAppointments);
  
    res.status(200).json({ upcomingAppointments });
  
    } catch (error) {
      console.error('Error in viewPatientAppointment:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  