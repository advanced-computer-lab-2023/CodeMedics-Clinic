const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor'); 
const Appointment = require('../../models/Appointment');

exports.filterAppointments = async (req, res) => { 
    console.log(req.body);
    console.log("here");
    const dr = new Doctor({
        FirstName: 'John',
        LastName: 'Smith',
        Username: 'thomasa',
        Password: 'password',
        Email: 'asf',
        DateOfBirth: '12/12/12',
        HourlyRate: 12,
        affiliation: 'aff',
        Degree: 'degree',
        Status: 'Pending',
        Specialty: 'specialty'

    });
    res.locals.token = dr;
    const status = req.body.status;
    const date = req.body.date;
    console.log(res.locals.token);
    const appointments = await Appointment.find({doctorUserName: res.locals.token.Username});
    if(status != null && status != undefined && status != ""){
        appointments = appointments.filter(appointment => appointment.status == status);
    }
    if(date != null && date != undefined && date != ""){
        appointments = appointments.filter(appointment => appointment.date == date);
    }
    console.log(appointments);
    res.render('doctor/viewAppointments', {appointments: appointments});
};;