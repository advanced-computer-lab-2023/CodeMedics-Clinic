const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient'); 
const Appointment = require('../../models/Appointment');
router.get('/', async (req, res) => { 
    const status = req.query.status;
    const date = req.query.date;
    const Patient = await Patient.findOne({Username: req.session.username});
    const appointments = await Appointment.find({PatientUserName: Patient.Username});
    if(status != null && status != undefined && status != ""){
        appointments = appointments.filter(appointment => appointment.status == status);
    }
    if(date != null && date != undefined && date != ""){
        appointments = appointments.filter(appointment => appointment.date == date);
    }
    res.render('Patient/viewappointments', {appointments: appointments});
});

module.exports = router;
exports.filterAppointmentsPatient = filterAppointmentsPatient;
