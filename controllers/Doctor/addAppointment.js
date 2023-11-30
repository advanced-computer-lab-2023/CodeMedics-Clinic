const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

exports.addAppointments = async (req, res) => {
    try {
        var {startHour, endHour, date} = req.body;
        date = date.split('T')[0];
        console.log("INSIDE ADD APPOINTMENTS BACKEND");
        startHour = startHour.substring(0, 2);
        endHour = endHour.substring(0, 2);
        console.log(startHour, endHour, date);

        const exists = await Appointment.findOne({date, startHour, endHour, doctorUsername: await getUsername(req, res)});

        console.log(exists, date, startHour, endHour, await getUsername(req, res));

        if(exists){
            return res.status(400).json({ message: "Appointment already exists" });
        }

        const dateToBeAdded = new Date(date);
        dateToBeAdded.setHours(startHour);
        dateToBeAdded.setMinutes(0);
        dateToBeAdded.setSeconds(0);
        dateToBeAdded.setMilliseconds(0);
        
        if(dateToBeAdded < new Date()){
            return res.status(400).json({ message: "Appointment date is in the past" });
        }
    
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
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



