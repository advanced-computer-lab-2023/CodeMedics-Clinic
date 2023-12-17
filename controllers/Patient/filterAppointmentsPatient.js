const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

exports.filterAppointmentsPatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({ Username: await getUsername(req, res) });
        console.log("in filter appointments patient", temp);
        if(patient == null){
            return res.status(404).json({ message: 'Patient does not exist' });
        }
        const appointments = [];
        for(let i=0; i<patient.Appointments.length ;i++){
            const appointment = await Appointment.findOne({ _id: patient.Appointments[i] });
            appointments.push(appointment);  
        }
        console.log(appointments);
        return res.status(200).json({appointments});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
