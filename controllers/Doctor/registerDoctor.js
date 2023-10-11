const doctorModel = require('../../models/Doctor.js');
const getUsername = require('../../config/usernameGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');


const createDoctor = asyncHandler(async (req, res) => {
    //create a Patient in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email', 'DateOfBirth', 'affiliation', 'HourlyRate', 'Degree'];

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
        affiliation,
        HourlyRate,
        Degree,
    } = req.body;
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    if (await getUsername.get(req, res) === '') {
        const newDoctor = new doctorModel({
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                Password: hashedPassword,
                Email: Email,
                DateOfBirth: DateOfBirth,
                HourlyRate: HourlyRate,
                affiliation: affiliation,
                Degree: Degree
            })
        ;
        await newDoctor.save();
        return res.status(201).json("Doctor created successfully!");

    } else {
        return res.status(400).json({message: "Username already exists"});
    }
});
const viewDoctorRegister = asyncHandler(async (req, res) => {
    res.render('DoctorViews/RegisterDoctor');
});
module.exports = {createDoctor, viewDoctorRegister};