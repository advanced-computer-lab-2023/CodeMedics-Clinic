const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');

exports.filterAppointments = async (req, res) => {
    try {
        const { Username } = req.query;
        const doctor = await Doctor.findOne({ Username });
        const appointments = [];
        for (let i = 0; i < doctor.Appointments.length; i++) {
            const appointment = await Appointment.findOne({ _id: doctor.Appointments[i] });
            appointments.push(appointment);
        }
        res.status(200).json({ appointments: appointments });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllApointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({ appointments: appointments });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


