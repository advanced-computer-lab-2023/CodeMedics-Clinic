//filter patients based on upcoming appointments
const express = require('express');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const appointment = require('../../models/Appointment');

router.get('/', async (req, res) => {
    //filter patients based on upcoming appointments
    const username = req.session.username;
    const myAppointments = await appointment.find({doctorUserName: username});
    Set<String> patients;
    patients = new Set();
    for (const appointment of myAppointments){
        if(appointment.date > Date.now())
            patients.add(appointment.patientUserName);
    }
    res.render('Doctor/filterPatient', {patients: patients});
});

module.exports = router;
exports.filterPatients = filterPatients;