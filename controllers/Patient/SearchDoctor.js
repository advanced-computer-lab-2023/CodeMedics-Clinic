const express = require('express');
const router = express.Router();
const patient = require('../../models/Patient');
const doctor = require('../../models/Doctor');


exports.searchDoctor = async (req, res) =>{
    const doctorName = req.query.doctorName;
    const doctors = await Doctor.find();
    (await doctor).filter(doctor => (doctor.FirstName + doctor.LastName).includes(doctorName));
    res.render('Doctor/viewpatients', {patients: patients});
};

