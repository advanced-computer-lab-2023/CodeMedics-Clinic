const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor'); 
const Appointment = require('../../models/Appointment');

exports.filterAppointments = async (req, res) => { 
    const username = req.query.username;
    const doctor = Doctor.findOne({username: username});
    const appointments = doctor.Appointments;
    res.status(200).json({appointments: appointments});
};;
