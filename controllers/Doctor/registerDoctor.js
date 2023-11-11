const doctorModel = require('../../models/Doctor.js');
const asyncHandler = require('express-async-handler');  
const multer = require('multer');
const uploads = require('../../config/multerConfig.js');
const infoGetter = require('../../config/infoGetter.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const createDoctor = asyncHandler(async (req, res) => {
    console.log(req.body);
    // Check if the required variables are present in the request body
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'affiliation', 'HourlyRate', 'Degree', 'Speciality'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({ message: `Missing ${variable} in the request body` });
        }
    }

    // Check for uploaded files
    if (!req.files || Object.keys(req.files).length !== 3) {
        return res.status(400).json({ message: 'Please upload ID Document, Medical Degree, and Medical License' });
    }
    
    try {
        // Access files in req.files with updated keys
        const idDocumentFile = req.files['nationalIdFile'][0].filename;
        const medicalDegreeFile = req.files['medicalDegreeFile'][0].filename;
        const medicalLicenseFile = req.files['medicalLicenseFile'][0].filename;

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.Password, salt);

        // Check if the username and email are unique (you may need to implement these functions)
        const newDoctor = new doctorModel({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            DateOfBirth: req.body.DateOfBirth,
            HourlyRate: req.body.HourlyRate,
            affiliation: req.body.affiliation,
            Degree: req.body.Degree,
            Speciality: req.body.Speciality,
            IDDocument: idDocumentFile,
            MedicalDegree: medicalDegreeFile,
            MedicalLicense: medicalLicenseFile
        });
        await newDoctor.save();

        const token = createToken(req.body.Username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        return res.status(200).json("Doctor created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = createDoctor;


const getAllDoctors = asyncHandler(async (req, res) => {
    try{
    const doctors = await doctorModel.find({});
    return res.status(200).json(doctors);
    }catch(error){
        return res.status(400).json({message: error.message});
    }
});

const viewDoctorRegister = asyncHandler(async (req, res) => {
    res.render('DoctorViews/RegisterDoctor');
});
module.exports = {createDoctor, viewDoctorRegister,getAllDoctors};