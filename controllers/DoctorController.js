const doctorModel = require('../models/Doctor.js');
const patientModel = require('../models/Patient.js');
const {default: mongoose} = require('mongoose');
const adminModel = require("../models/Administrator");


const createAdmin = async (req, res) => {
    //create an admin in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['FirstName', 'LastName', 'Username', 'Password', 'Email','DateOfBirth','HourlyRate','affiliation','Degree'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }

    // If all required variables are present, proceed with creating an admin
    const {Name, Username, Password, Email} = req.body;

    if (await usernameCheck(req, res) == '') {
        const newAdmin = new adminModel({Name, Username, Password, Email});
        try {
            await newAdmin.save();
            return res.status(201).json("Admin created successfully!");
        } catch (error) {
            return res.status(409).json({message: error.message});
        }
    } else {
        return res.status(400).json({message: "Username already exists"});
    }


}