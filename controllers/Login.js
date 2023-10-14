const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");
const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const Login = AsyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    if (!req.body.Username || req.body.Username === '') {
        return res.status(400).json({message: 'Missing Username in the request body'});
    }
    if (!req.body.Password || req.body.Password === '') {
        return res.status(400).json({message: 'Missing Password in the request body'});
    }
    const {Username, Password} = req.body;

    const admin = await adminModel.findOne({Username});
    const doctor = await doctorModel.findOne({Username});
    const patient = await patientModel.findOne({Username});

    if (admin && (await bcrypt.compare(Password, admin.Password))) {
        //redirect to admin page
        const formattedJson = JSON.stringify(admin, null, 2);

        return res.status(200).json({
            message: "Admin login successful",
            admin: JSON.parse(formattedJson) // Parse it back to an object for the response
        });
    }
    if (doctor && (await bcrypt.compare(Password, doctor.Password))) {
        //redirect to doctor page
        const formattedJson = JSON.stringify(doctor, null, 2);

        return res.status(200).json({
            message: "doctor login successful",
            admin: JSON.parse(formattedJson) // Parse it back to an object for the response
        });
    }

    if (patient && (await bcrypt.compare(Password, patient.Password))) {
        //redirect to patient page
        const formattedJson = JSON.stringify(patient, null, 2);

        return res.status(200).json({
            message: "Patient login successful",
            admin: JSON.parse(formattedJson) // Parse it back to an object for the response
        });
    } else {
        return res.status(400).json({message: "Invalid username or password"});
    }


});
module.exports = {Login};