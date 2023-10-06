const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");


const get = async (req, res) => {
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
module.exports = {get};