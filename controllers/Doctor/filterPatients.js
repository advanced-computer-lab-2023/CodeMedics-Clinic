//filter patients based on upcoming appointments
const express = require('express');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const Appointment = require('../../models/Appointment');
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
    // const appointment = await Appointment.create({doctor: "Mohamed Ahmed", patient: "yyousef koka", date: "2023-10-29", startHour: 4,endHour:9, status: "Upcoming"}); 
    // console.log(appointment);
    // await appointment.save();
    res.status(200).json({data: patients});
    }catch(error){
        res.status(400).json({message: error.message});
    }
};