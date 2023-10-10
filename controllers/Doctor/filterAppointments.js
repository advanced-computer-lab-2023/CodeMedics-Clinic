const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor'); 
const Appointment = require('../../models/Appointment');

exports.filterAppointments = async (req, res) => { 
    const status = req.query.status;
    const date = req.query.date;
    const doctor = await Doctor.findOne({Username: req.session.username});
    const appointments = await Appointment.find({doctorUserName: doctor.Username});
    if(status != null && status != undefined && status != ""){
        appointments = appointments.filter(appointment => appointment.status == status);
    }
    if(date != null && date != undefined && date != ""){
        appointments = appointments.filter(appointment => appointment.date == date);
    }
    res.render('Doctor/viewappointments', {appointments: appointments});
};;
