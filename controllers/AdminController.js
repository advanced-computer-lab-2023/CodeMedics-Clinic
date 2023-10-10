const userModel = require('../models/Administrator.js');
const {default: mongoose} = require('mongoose');

const createAdmin = async (req, res) => {
    //create a new Admin in the database

}

const getAllAdmins = async (req, res) => {
//get all admins from the database
}


const updateAdmin = async (req, res) => {
    //update an admin in the database
}

const deleteAdmin = async (req, res) => {
    //delete an Admin from the database
}
const getAllDoctorsApps = async (req, res) => {
    //get all doctors applications from the database
}


module.exports = {createAdmin, getAllAdmins, updateAdmin, deleteAdmin};