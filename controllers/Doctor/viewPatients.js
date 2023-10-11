const mongoose = require('mongoose');
const Doctor = require('../../models/Doctor');
const express = require('express');

exports.viewPatients = async (req, res) =>{
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
        Specialty: 'specialty',
        Patients: []
    });
    res.locals.token = dr;
    const username = res.locals.Username;
    const temp = await Doctor.find();
    console.log(temp);
    const doctor = dr;
    const patients = doctor.Patients;
    res.render('doctor/viewPatients', {patients: patients});
};