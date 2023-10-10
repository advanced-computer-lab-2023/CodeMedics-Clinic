const doctor = require('../../models/Doctor');
const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');

router.get('/', async (req, res) =>{
    const patientName = req.query.patientName;
    const patients = await Patient.find();
    (await patients).filter(patient => (patient.FirstName + patient.LastName).includes(patientName));
    res.render('Doctor/viewpatients', {patients: patients});
});

module.exports = router;
exports.viewPatients = viewPatients;