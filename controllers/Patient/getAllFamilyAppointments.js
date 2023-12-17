const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

exports.getAllFamilyAppointments = async (req, res) => {
    try {
        const Username = await getUsername(req, res);
        console.log("in get all family appointments", Username);

        const patient = await Patient.findOne({ Username});
        console.log("in get all appointments");
        if(patient == null){
            return res.status(404).json({ message: 'Patient does not exist' });
        }
        const appointments = [];
        for(let i=0; i<patient.Appointments.length ;i++){
            const appointment = await Appointment.findOne({ _id: patient.Appointments[i] });
            appointments.push(appointment);  
        }
        console.log(patient.FamilyMembers);
        for(let i = 0; i < patient.FamilyMembers.length; i++){
            const tempPatient = await Patient.findOne({ _id: patient.FamilyMembers[i].id });
            console.log("temp patient", patient.FamilyMembers[i].id);
            for(let j = 0; j < tempPatient.Appointments.length; j++){
                const appointment = await Appointment.findOne({ _id: tempPatient.Appointments[j] });
                appointments.push(appointment);
            }
        }
        console.log("loaded all appointments");
        return res.status(200).json({appointments});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};