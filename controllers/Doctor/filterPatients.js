//filter patients based on upcoming appointments
const express = require('express');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const appointment = require('../../models/Appointment');

exports.filterPatients = async (req, res) => {
    const username = req.query.username;
    const Doctor = await Doctor.findOne({username: username});  
    const patients = Doctor.Patients;
    res.status(200).json({patients: patients});
};;