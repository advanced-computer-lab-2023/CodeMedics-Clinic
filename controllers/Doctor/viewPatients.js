const mongoose = require('mongoose');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const express = require('express');
const {getUsername} = require('../../config/infoGetter');

exports.viewPatients = async (req, res) =>{
    const username = await getUsername(req, res);
    console.log("in view patients");
    if(username === "")return res.status(401).json({message:"You are not logged in."})
    console.log(username);
    const doctor = await Doctor.find({Username: username});
    console.log(doctor);
    console.log(doctor[0].FirstName);
    console.log(doctor[0].Patients);
    const patients = [];
    for(var i = 0; i < doctor[0].Patients.length; i++){
        const cur = await Patient.findOne({_id: doctor[0].Patients[i]});
        patients.push(cur);
    }
    console.log(patients);
    res.render('doctor/viewPatients', {patients: patients});
};