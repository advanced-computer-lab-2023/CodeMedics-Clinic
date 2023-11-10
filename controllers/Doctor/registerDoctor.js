const doctorModel = require('../../models/Doctor.js');
const infoGetter = require('../../config/infoGetter.js');
const upload = require('../../config/multerConfig.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');




const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const createDoctor = asyncHandler(async (req, res) => {
    // Check if the required variables are present in the request body
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'affiliation', 'HourlyRate', 'Degree', 'Specialty'];

    for (const variable of requiredVariables) {
        
        if (!req.body[variable]) {
            return res.status(400).json({ message: `Missing ${variable} in the request body` });
        }
    }

    // Check for uploaded files
    if (!req.files || Object.keys(req.files).length !== 3) {
        return res.status(400).json({ message: 'Please upload ID Document, Medical Degree, and Medical License' });
    }
    const { IDDocument, MedicalDegree, MedicalLicense } = req.files;

    try {
        // Handle file uploads (files are available in req.files)
        const idDocumentFile = IDDocument[0].filename;
        const medicalDegreeFile = MedicalDegree[0].filename;
        const medicalLicenseFile = MedicalLicense[0].filename;

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
            Specialty: req.body.Specialty,
            IDDocument: idDocumentFile,
            MedicalDegree: medicalDegreeFile,
            MedicalLicense: medicalLicenseFile
        });
        await newDoctor.save();
        const token = createToken(req.body.Username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.status(201).json("Doctor created successfully");
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

    try {
        // Fetch the doctor's current data from the database using their username
        const doctor = await doctorModel.findOne({ Username: username });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Verify if the current password matches the one in the database
        const passwordMatch = await bcrypt.compare(currentPassword, doctor.Password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

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