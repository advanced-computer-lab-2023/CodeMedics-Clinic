const express = require('express');
const router = express.Router();
const Appointments = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');

exports.CancelAppointment = async (req, res) => {
    try{
        const { appointmentID } = req.body;
        const appointment = await Appointments.findOne({_id: appointmentID});
        const currentDate = new Date();
        const appointmentDate = new Date(appointment.date);
        if(Math.abs(currentDate - appointmentDate) < 24){
            appointment.status = 'cancelled';
            await appointment.save();
        }else{
            const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
            const patient = await Patient.findOne({Username: appointment.patient});
            const appointmentPrice = Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour));
            doctor.Wallet = doctor.Wallet - appointmentPrice; // handle case that the wallet is initially empty ... or maybe it's a feature :)
            patient.Wallet = patient.Wallet + appointmentPrice;
            appointment.status = 'unreserved';
            await doctor.save();
            await patient.save();
            await appointment.save();
        }
        res.status(200).json({message: 'Appointment Cancelled Successfully'});

    }catch(error) {
        return res.status(500).json({message: 'Something Wrong Happened while Cancelling'})
    }
};