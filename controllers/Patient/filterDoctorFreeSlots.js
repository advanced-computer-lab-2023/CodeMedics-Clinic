const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');

exports.filterDoctorFreeSlots = async (req, res) => {
    try {
        const { doctorUsername } = req.query;
        const doctor = await Doctor.find({Username: doctorUsername});
        const appointments = [];
        for (let i = 0; i < doctor[0].Appointments.length; i++) {
            const appointment = await Appointment.findOne({ _id: doctor[0].Appointments[i] });
            const curAppointmentDate = new Date(appointment.date);
            curAppointmentDate.setHours(appointment.startHour);
            curAppointmentDate.setMinutes(0);
            curAppointmentDate.setSeconds(0);
            curAppointmentDate.setMilliseconds(0);
            if(appointment.status == "unreserved" && curAppointmentDate >= Date.now()){
                appointments.push(appointment);
            }
        }
        res.status(200).json({ appointments: appointments });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



