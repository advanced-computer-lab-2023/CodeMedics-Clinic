const adminModel = require("../models/Administrator");
const doctorModel = require("../models/Doctor");
const patientModel = require("../models/Patient");
const {getUsername} = require('../config/infoGetter.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const login = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try {
        var patient = null, doctor = null, admin = null;
        if (username) {
            patient = await patientModel.findOne({ Username: username });
            doctor = await doctorModel.findOne({ Username: username });
            admin = await adminModel.findOne({Username: username });
        } if (email) {
            patient = await patientModel.findOne({ Email: email });
            doctor = await doctorModel.findOne({ Email: email });
            admin = await adminModel.findOne({Email: email });
        }
        if (!patient && !doctor && !admin) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (patient) {
            const auth = await bcrypt.compare(password, patient.Password);
            if (auth) {
                const token = createToken(patient.Username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.status(200).json({ Type: 'Patient', message: 'Login successful' , patient , token});
            }
            else {
                return res.status(401).json({ message: 'Wrong password' });
            }
        } else if (doctor) {
            const auth = await bcrypt.compare(password, doctor.password);
            if (auth) {
                const token = createToken(doctor.username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.status(200).json({ Type: 'Doctor', message: 'Login successful' , doctor , token});
            }
            else {
                return res.status(401).json({ message: 'Wrong password' });
            }
        } else if (admin) {
            const auth = await bcrypt.compare(password, admin.Password);
            if (auth) {
                const token = createToken(admin.Username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.status(200).json({ Type: 'Admin', message: 'Login successful' , admin , token});
            }
            else {
                return res.status(401).json({ message: 'Wrong password' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: "User logged out" });
}

module.exports = { logout, login };
