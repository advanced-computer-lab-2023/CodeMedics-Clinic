const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const Doctor= require ('../../models/Doctor');
exports.getAvailableAppointments = async (req, res) => {
    const { doctorUsername } = req.params;
    const doctor = await Doctor.findOne({ Username: doctorUsername });
    try {
        
        const doctorAppointments = await doctor.AvailableTimeSlots;

        res.status(200).json({ availableAppointments: doctorAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
