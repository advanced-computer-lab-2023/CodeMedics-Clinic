const mongoose = require('mongoose');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const express = require('express');
const {getUsername} = require('../../config/infoGetter');

exports.viewPatients = async (req, res) =>{
    const username = await getUsername(req, res);
    console.log("in view patients");
    if(username === "")return res.status(401).json({message:"You are not logged in."})
    const doctor = await Doctor.find({Username: username});
    console.log(doctor);
    const patients = [];
    for(var i = 0; i < doctor[0].Patients.length; i++){
        const cur = await Patient.findOne({_id: doctor[0].Patients[i]});
        if(cur){
            patients.push(cur);
        }
    }
    console.log(patients);
    return res.status(200).json(patients);
};

exports.getPatientByUsername = async (req, res) => {
    const username = req.query.username;
    console.log(username);
    try{
        const patient = await Patient.findOne({Username: username});
        console.log("TESTING GetPatientByUsername", patient);
        return res.status(200).json(patient);
    }catch(error){
        console.log(error);
    }
};