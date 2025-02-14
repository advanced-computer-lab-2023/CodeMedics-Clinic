const patientModel = require('../models/Patient');
const adminModel = require('../models/Administrator');
const doctorModel = require('../models/Doctor');
const {getUsername} = require('../config/infoGetter.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../models/FamilyMember');
const schedule = require('node-schedule');
const jwt = require('jsonwebtoken');


exports.getMe = asyncHandler(async (req, res) => {
    const user = await patientModel.findOne({username: await getUsername(req, res)}) || await adminModel.findOne({username: await getUsername(req, res)}) || await doctorModel.findOne({username: await getUsername(req, res)});
    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(400).json({message: "Patient not found!"});
    }
});