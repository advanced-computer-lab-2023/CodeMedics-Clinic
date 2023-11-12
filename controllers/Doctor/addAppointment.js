const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

exports.addAppointments = async (req, res) => {
    try {
        const {startHour, endHour, date} = req.body;
        const Username = await getUsername(req, res);
        const doctor = await Doctor.findOne({Username});
        const doctorName = doctor.FirstName + " " + doctor.LastName;
        const appointment = new Appointment({  
            doctor: doctorName,
            doctorUsername: Username,
            patient: null,
            date: date,
            startHour: startHour,
            endHour: endHour,
            status: "unreserved"
        });
        await appointment.save();
        doctor.Appointments.push(appointment._id);
        await doctor.save();
        res.status(200).json({ message: "Appointment added successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



