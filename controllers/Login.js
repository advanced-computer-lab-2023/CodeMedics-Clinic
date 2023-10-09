const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");

const Login = async (req, res) => {
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


    try {
        const admin = await adminModel.findOne({Username});
        const doctor = await doctorModel.findOne({Username});
        const patient = await patientModel.findOne({Username});
        switch (true) {
            case admin !== null:
                if (admin.Password === Password) {
                    //redirect to admin page
                    return res.status(200).json({message: "Admin login successful"});
                } else {
                    return res.status(400).json({message: "Incorrect password"});
                }
            case doctor !== null:
                if (doctor.Password === Password) {
                    //redirect to doctor page
                    return res.status(200).json({message: "Doctor login successful"});
                } else {
                    return res.status(400).json({message: "Incorrect password"});
                }
            case patient !== null:
                if (patient.Password === Password) {
                    //redirect to patient page
                    return res.status(200).json({message: "Patient login successful"});
                } else {
                    return res.status(400).json({message: "Incorrect password"});

                }
            default:
                return res.status(400).json({message: "Username does not exist"});
        }
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};
module.exports = {Login};