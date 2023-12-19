const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const {oldAppointmentId} = req.query;
        const status = req.query.status;
        console.log(oldAppointmentId, status);
        const appointment = await Appointment.findOne({ _id: oldAppointmentId });
        if(status){
            appointment.status = status;
        }
        else
            appointment.status = "completed";
        await appointment.save();
        res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



