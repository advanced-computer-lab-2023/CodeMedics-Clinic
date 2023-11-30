const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');

exports.getAppointmentAmount = async (req, res) => {
    const appointmentId = req.query.appointmentId;
    const appointment = await Appointment.findOne({_id: appointmentId});
    const doctor = await Doctor.findOne({_id: appointment.doctor});
    const amount = (appointment.endHour - appointment.startHour) * doctor.HourlyRate;
    res.status(200).json({amount: amount});
};



