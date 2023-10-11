const express = require('express');
const router = express.Router();
const doctor = require('../../models/Doctor');


exports.searchDoctor = async (req, res) => {
    const doctorName = req.body.FirstName;// Assuming the request contains a 'FirstName' property.
    console.log(doctorName);
    // Query the Doctor model (assuming it's a Mongoose model) to find doctors by name.
    try {
        const doctors = await doctor.find({
            $or: [
                { FirstName: { $regex: doctorName, $options: 'i' } },
                { LastName: { $regex: doctorName, $options: 'i' } }
            ]
        });
        res.status(200).json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while searching for doctors.' });
    }
};
