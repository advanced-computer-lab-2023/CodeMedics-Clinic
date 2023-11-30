const doctorModel = require('../../models/Doctor.js');
const adminModel = require('../../models/Administrator.js');
const patientModel = require('../../models/Patient.js');
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
    
    const { Username, Email } = req.body;

    //check if the username is already taken
    const existingUser = await adminModel.findOne({ Username: Username }) || await doctorModel.findOne({ Username: Username }) || await patientModel.findOne({ Username: Username });
    if (existingUser) {
        return res.status(400).json({message: 'Username already taken'});
    }

    //check if the email is already taken
    const existingEmail = await adminModel.findOne({ Email: Email }) || await doctorModel.findOne({ Email: Email }) || await patientModel.findOne({ Email: Email });
    if (existingEmail) {
        return res.status(400).json({message: 'Email already taken'});
    }

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

const changePassword = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    console.log("Here ---> " , username , currentPassword , newPassword);
    try {
        // Fetch the doctor's current data from the database using their username
        const doctor = await doctorModel.findOne({ Username: username });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Verify if the current password matches the one in the database
        // const passwordMatch = await bcrypt.compare(currentPassword, doctor.Password);

        // if (!passwordMatch) {
        //     return res.status(400).json({ error: 'Current password is incorrect' });
        // }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the doctor's password in the database
        doctor.Password = hashedPassword;
        await doctor.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {createDoctor, viewDoctorRegister,getAllDoctors, changePassword};