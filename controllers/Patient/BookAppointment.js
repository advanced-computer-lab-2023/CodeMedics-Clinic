const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');

exports.bookAppointment = async (req, res) => {
    try {
        const { appointmentId, patientUsername } = req.query;
        const appointment = await Appointment.findOne({_id: appointmentId});
        appointment.patient = patientUsername;
        appointment.status = "upcoming";
        await appointment.save();
        res.status(200).json({ message: "Appointment booked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



