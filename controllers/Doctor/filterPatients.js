//filter patients based on upcoming appointments
const express = require('express');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const appointment = require('../../models/Appointment');

exports.filterPatients = async (req, res) => {
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
    const username = res.locals.token.username;
    const myAppointments = await appointment.find({doctorUserName: username});
    // find the patients from the appointments and remove duplicates having the same username
    const patients = [];
    myAppointments.forEach(appointment => {
        if(!patients.includes(appointment.patientUserName)){
            patients.push(appointment.patientUserName);
        }
    });
    const patientObjects = [];
    patients.forEach(async patient => {
        const patientObject = await Patient.find({Username: patient});
        patientObjects.push(patientObject);
    });
    res.render('doctor/filterPatients', {patients: patientObjects});
};;