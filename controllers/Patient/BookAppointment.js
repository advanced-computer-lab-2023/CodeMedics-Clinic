const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');

exports.bookAppointment = async (req, res) => {
    try {
        const { appointmentId, patientUsername } = req.query;
        const appointment = await Appointment.findOne({_id: appointmentId});
        appointment.patient = patientUsername;
        appointment.status = "upcoming";
        await appointment.save();
        const patient = await Patient.findOne({Username: patientUsername});
        patient.Appointments.push(appointmentId);
        await patient.save();
        const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
        if(!doctor.Patients.includes(patient._id)){
            doctor.Patients.push(patient._id);
        }
        await doctor.save();
        res.status(200).json({ message: "Appointment booked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



