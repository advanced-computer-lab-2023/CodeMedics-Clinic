const doctor = require('../../models/Doctor');
const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
exports.searchPatient = async (req, res) =>{
    console.log('we are here');
    const patientName = req.body.patientName;
    const patients = await Patient.find();
    (await patients).filter(patient => (patient.FirstName + " " + patient.LastName).includes(patientName));
    res.render('doctor/searchPatient', {patients: patients});
};