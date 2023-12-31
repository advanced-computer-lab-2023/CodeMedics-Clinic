const express = require('express');
const router = express.Router();
const doctor = require('../../models/Doctor');


exports.searchDoctor = async (req, res) => {
    const FirstName = req.query.FirstName;// Assuming the request contains a 'FirstName' property.
    const LastName = req.query.LastName;
    const Speciality = req.query.Speciality;
    console.log(FirstName);
    console.log(LastName);
    console.log(Speciality);

    const query = {};

    if (FirstName.length > 0) {
        query.FirstName = { $regex: FirstName, $options: 'i' };
    }
    if (LastName.length > 0) {
        query.LastName = { $regex: LastName, $options: 'i' };
    }
    if (Speciality.length > 0) {
        query.Specialty = { $regex: Speciality, $options: 'i' };
    }
    console.log(query);
    if(Object.keys(query).length == 0){
        res.status(400).json({ message: 'At least one search criterion must be provided.' });
        return;
    }

    // Query the Doctor model (assuming it's a Mongoose model) to find doctors by name.
    try {
        const doctors = await doctor.find(query);
        res.status(200).json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while searching for doctors.' });
    }
};

exports.getDoctorByUsername = async (req, res) => {
    const username = req.query.username;// Assuming the request contains a 'username' property.
    console.log(username);
    if(username.length == 0){
        res.status(400).json({ message: 'A username must be provided.' });
        return;
    }

    // Query the Doctor model (assuming it's a Mongoose model) to find doctors by name.
    try {
        const doctorByUsername = await doctor.findOne({Username: username});
        res.status(200).json({doctor: doctorByUsername});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while searching for doctors.' });
    }
};
