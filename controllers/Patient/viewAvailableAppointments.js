const Appointment = require('../../models/Appointment');
exports.getAvailableAppointments = async (req, res) => {
    const { doctorUsername } = req.query;
    try {
        const availableAppointments = await Appointment.find({ doctorUsername: doctorUsername, status: "unreserved" });
        res.status(200).json({ data: availableAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
