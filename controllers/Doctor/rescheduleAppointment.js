const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

exports.rescheduleAppointment = async (req, res) => {
    try {
        const patientUsername = req.params.patientUsername; // Extract patient username from URL
        const { appointmentId, startHour, endHour, date } = req.body;
        console.log("INSIDE RESCHEDULE APPOINTMENT BACKEND");
        
        const doctorUsername = await getUsername(req, res);

        // Find the existing appointment for the patient, doctor, and appointment ID
        const existingAppointment = await Appointment.findOne({
            _id: appointmentId,
            doctorUsername,
            //patient: patientUsername,
            status: { $in: ['upcoming', 'rescheduled'] }
        });

        if (!existingAppointment) {
            return res.status(400).json({ message: "No valid appointment found for rescheduling" });
        }

        // Update the existing appointment details
        existingAppointment.date = date.split('T')[0];
        existingAppointment.startHour = startHour.substring(0, 2);
        existingAppointment.endHour = endHour.substring(0, 2);
        existingAppointment.status = 'rescheduled';

        await existingAppointment.save();

        res.status(200).json({ message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
