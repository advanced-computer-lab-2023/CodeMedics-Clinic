const mongoose = require('mongoose');
const Doctor = require('../../models/Doctor');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) =>{
    const username = req.session.username;
    const doctor = await Doctor.findOne({Username: username});
    const patients = doctor.Patients;
    res.render('Doctor/viewpatients', {patients: patients});
});

module.exports = router;
exports.viewPatients = viewPatients;