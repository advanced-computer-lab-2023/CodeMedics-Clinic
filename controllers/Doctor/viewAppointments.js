const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');

exports.viewUpcomingAppointments = async (req, res) => {
    try {
        const { doctorUsername } = req.params;
        const doctor = await Doctor.findOne({ Username: doctorUsername });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const currentDate = new Date().toISOString(); // Use UTC format

        // Filter appointments with status "upcoming" or "rescheduled"
        const upcomingAppointments = await Appointment.find({
            _id: { $in: doctor.Appointments },
            status: { $in: ['upcoming', 'rescheduled'] }
        }).lean();

        res.status(200).json({ upcomingAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.viewPastAppointments = async (req, res) => {
    try {
        const { doctorUsername } = req.params;
        const doctor = await Doctor.findOne({ Username: doctorUsername });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Filter appointments with status "completed," "cancelled," or "rescheduled"
        const pastAppointments = await Appointment.find({
            _id: { $in: doctor.Appointments },
            status: { $in: ['completed', 'cancelled'] }
        }).lean();

        res.status(200).json({ pastAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
