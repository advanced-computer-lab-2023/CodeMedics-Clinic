const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.filterAppointmentsPatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({ Username: req.query.Username });
        if(patient == null){
            return res.status(404).json({ message: 'Patient does not exist' });
        }
        const appointments = [];
        for(let i=0; i<patient.Appointments.length ;i++){
            const appointment = await Appointment.findOne({ _id: patient.Appointments[i] });
            appointments.push(appointment);  
        }
        res.status(200).json({data: appointments});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
