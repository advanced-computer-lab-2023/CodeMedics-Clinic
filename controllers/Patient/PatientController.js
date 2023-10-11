const patientModel = require('../../models/Patient.js');
const getUsername = require('../../config/usernameGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');


const createPatient = asyncHandler(async (req, res) => {
    //create a Patient in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'Gender', 'MobileNumber', 'EmergencyContactName', 'EmergencyContactNumber'];

    for (const variable of requiredVariables) {
        console.log(req.body[variable]);
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }
    // If all required variables are present, proceed with creating an admin
    const {
        FirstName,
        LastName,
        Username,
        Password,
        Email,
        DateOfBirth,
        Gender,
        MobileNumber,
        EmergencyContactName,
        EmergencyContactNumber
    } = req.body;
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    if (await getUsername.get(req, res) === '') {
        const newPatient = new patientModel({
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                Password: hashedPassword,
                Email: Email,
                DateOfBirth: DateOfBirth,
                Number: MobileNumber,
                Gender: Gender,
                EmergencyContacts: {
                    EmergencyContactName: EmergencyContactName, EmergencyContactNumber: EmergencyContactNumber
                }
            })
        ;
        await newPatient.save();
        return res.status(201).json("Patient created successfully!");

    } else {
        return res.status(400).json({message: "Username already exists"});
    }
});
const viewPatientRegister = asyncHandler(async (req, res) => {
    res.render('PatientViews/RegisterPatient');
});
module.exports = {createPatient, viewPatientRegister};