const express = require('express');
const router = express.Router();
const Appointments = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Package = require('../../models/Package');

exports.CancelAppointment = async (req, res) => {
    try{
        const { appointmentID } = req.query;
        console.log("IN CANCEL APPOINTMENT", appointmentID);
        const appointment = await Appointments.findOne({_id: appointmentID});
        const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
        const patient = await Patient.findOne({Username: appointment.patient});
        const package = await Package.findOne({ Name: patient.HealthPackage.membership });
        var discount = 0;
        if(package){
            discount = package.SessionDiscount;
        }
        const appointmentPrice = ((Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour))) * doctor.HourlyRate) ;
        doctor.Wallet = doctor.Wallet - appointmentPrice; // handle case that the wallet is initially empty ... or maybe it's a feature :)
        patient.Wallet = patient.Wallet + (appointmentPrice * 1.1 - discount); //TODO handle correct calculation
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