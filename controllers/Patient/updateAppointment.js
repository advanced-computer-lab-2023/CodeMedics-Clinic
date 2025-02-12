const Appointment = require('../../models/Appointment');

exports.updateAppointment = async (req, res) => {
    try {
        const {appointmentId} = req.params;
        const {status} = req.body;
        const appointment = await Appointment.findOne({ _id: appointmentId });
        if(status){
            appointment.status = status;
        }
        await appointment.save();
        res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



