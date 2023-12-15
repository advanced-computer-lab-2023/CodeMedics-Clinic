const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.RequestFollowUp = async (req, res) => {
    try {
        const {appointmentID} = req.query;
        const appointment = await Appointment.findOne({ _id: appointmentID });
        console.log(appointment);
        appointment.status = "follow-up Requested";
        await appointment.save();
        res.status(200).json({ message: 'Appointment requested for follow up successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



