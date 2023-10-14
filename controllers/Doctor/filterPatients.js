//filter patients based on upcoming appointments
const express = require('express');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');

exports.filterPatients = async (req, res) => {
    try{
    const {Username} = req.query;
    const doctor = await Doctor.findOne({Username});  
    const patients = [];
    for(let i = 0; i < doctor.Patients.length; i++){
        const patient = await Patient.findOne({_id: doctor.Patients[i]});
        patients.push(patient);
    }
    res.status(200).json({data: patients});
    }catch(error){
        res.status(400).json({message: error.message});
    }
};;