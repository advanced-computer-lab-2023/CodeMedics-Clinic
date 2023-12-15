const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.RescheduleAppointment = async (req, res) => {
    try {
        const {appointmentID, oldAppointmentID, username} = req.query;

        console.log("in reschedule appointment");
        console.log(appointmentID, oldAppointmentID, username);
        const patient = await Patient.findOne({Username: username});
        const appointment = await Appointment.findOne({ _id: appointmentID });
        const oldAppointment = await Appointment.findOne({ _id: oldAppointmentID });
        console.log(patient, appointment, oldAppointment);
        console.log(patient.Appointments);
        patient.Appointments = patient.Appointments.filter(item => item != oldAppointmentID);
        patient.Appointments.push(appointmentID);
        console.log(patient.Appointments);
        appointment.patient = oldAppointment.patient;
        appointment.status = "upcoming";
        oldAppointment.patient = null;
        oldAppointment.status = "unreserved";
        console.log(appointment, oldAppointment, patient);
        await appointment.save();
        await oldAppointment.save();
        await patient.save();
        res.status(200).json({ message: 'Appointment rescheduled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



