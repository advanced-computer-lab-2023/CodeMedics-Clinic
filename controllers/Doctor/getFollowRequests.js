const Doctor = require('../../models/Doctor');
const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
exports.getFollowRequests = async (req, res) =>{
    const doctorUsername = req.query.username;
    console.log("in get follow requests");
    const doctor = await Doctor.findOne({Username: doctorUsername});
    // console.log(doctor);
    const appointments = await Appointment.find({doctorUsername: doctorUsername});
    // console.log(appointments);
    const followUpRequests = appointments.filter(appointment => appointment.status === "follow-up Requested");
    console.log(followUpRequests);
    res.status(200).json(followUpRequests);
};