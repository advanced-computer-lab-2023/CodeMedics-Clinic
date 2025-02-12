const Appointment = require('../../models/Appointment');

exports.updateAppointment = async (req, res) => {
    try {
        const {appointmentId} = req.params;
        const appointment = await Appointment.findOne({ _id: appointmentId });
        if('status' in req.body){
            appointment.status = req.body.status;
        }
        if('patient' in req.body){
            appointment.patient = req.body.patient;
        }
        
        await appointment.save();
        res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



