const adminModel = require('../models/Administrator.js');
const doctorModel = require('../models/Doctor.js');
const patientModel = require('../models/Patient.js');
const {default: mongoose} = require('mongoose');
const getUsername = require('../config/usernameGetter');

const createAdmin = async (req, res) => {
    //create an admin in the database
    //check req body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    const requiredVariables = ['Name', 'Username', 'Password', 'Email'];

    for (const variable of requiredVariables) {
        if (!req.body[variable]) {
            return res.status(400).json({message: `Missing ${variable} in the request body`});
        }
    }

    // If all required variables are present, proceed with creating an admin
    const {Name, Username, Password, Email} = req.body;

    if (await getUsername.get(req, res) == '') {
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

const getAllAdmins = async (req, res) => {
//get all admins from the database
}


const updateAdmin = async (req, res) => {
    //update an admin in the database
}

const removeAdmin = async (req, res) => {
    //delete an Admin from the database
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Request body is empty'});
    }
    // Check if 'Username' is present in the request body
    if (!req.body['Username']) {
        return res.status(400).json({message: 'Missing Username in the request body'});
    }
    const {Username} = req.body;
    if (await getUsername.get(req, res) != '') {
        const username = await getUsername.get(req, res);
        try {
            await Promise.all([
                adminModel.deleteOne({Username: username}),
                patientModel.deleteOne({Username: username}),
                doctorModel.deleteOne({Username: username})
            ]);

            console.log('User deleted successfully:', Username);
            return res.status(201).json(Username + "'s account has been Deleted!")
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({message: 'Error deleting user'});
        }
    } else {
        return res.status(404).json("User not found in database!");
    }
}
const getAllDoctorsApps = async (req, res) => {
    //get all doctors applications from the database

}


module.exports = {createAdmin, getAllAdmins, updateAdmin, removeAdmin};