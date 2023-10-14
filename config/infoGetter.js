const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");


const getUsername = async (req, res) => {
    const {Username} = req.body;

    try {
        const usernameExists = await adminModel.findOne({Username}) || await doctorModel.findOne({Username}) || await patientModel.findOne({Username});
        if (usernameExists) {
            return usernameExists.Username;
        }
        return '';
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};
const getEmail = async (req, res) => {
    const {Email} = req.body;

    try {
        const emailExists = await adminModel.findOne({Email}) || await doctorModel.findOne({Email}) || await patientModel.findOne({Email});
        if (emailExists) {
            return emailExists.Email;
        }
        return '';
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

module.exports = {getUsername, getEmail};

