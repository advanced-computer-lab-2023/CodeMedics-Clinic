const express = require('express');
const router = express.Router();
const Appointments = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');

exports.CancelAppointment = async (req, res) => {
    try{
        const { appointmentID } = req.query;
        console.log("IN CANCEL APPOINTMENT", appointmentID);
        const appointment = await Appointments.findOne({_id: appointmentID});
        const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
        const patient = await Patient.findOne({Username: appointment.patient});
        const appointmentPrice = Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour));
        doctor.Wallet = doctor.Wallet - appointmentPrice; // handle case that the wallet is initially empty ... or maybe it's a feature :)
        patient.Wallet = patient.Wallet + appointmentPrice;
        appointment.status = 'cancelled';
        await doctor.save();
        await patient.save();
        await appointment.save();
        
        res.status(200).json({message: 'Appointment Cancelled Successfully'});

    }catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Something Wrong Happened while Cancelling'})
    }
};