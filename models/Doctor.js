const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Patient = require('./Patient');
const doctorSchema = new Schema({
    FirstName: {
        type: String,
        required: [true, 'Please enter a first name']
    },
    LastName: {
        type: String,
        required: [true, 'Please enter a last name']
    },
    Username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    Password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    Email: {
        type: String,
        required: [true, 'Please enter an email']
    },
    DateOfBirth: {
        type: String,
        required: [true, 'Please enter a Date of Birth']
    },
    HourlyRate: {
        type: Number,
        required: [true, 'Please enter an hourly rate']
    },
    affiliation: {
        type: String,
        required: [true, 'Please enter an affiliation']
    },
    Degree: {
        type: String,
        required: [true, 'Please enter a degree']

    },
    Status: {
        type: String,
        enum: ['Approved', 'Pending', 'Contract', 'Rejected'],
        default: 'Pending',
        required: false,
    },
    Speciality: {
        type: String,
        required: [true, 'Please enter a specialty']
    },
    Patients: {
        type: [String],
        required: false
    },
    Appointments: {
        type: [String],
        required: false
    },
    Wallet: {
        type: Number,
        default: 0,
        required: false
    },
    SocketID: { type: String, required: false },
    IDDocument: { type: String },
    MedicalDegree: { type: String },
    MedicalLicense: { type: String },
    AvailableTimeSlots: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    }],

    Messages: {
        type: [{
            sender: String,
            content: String,
            timestamp: { type: Date, default: Date.now },
        }],
        default: [],
        required: false,
    },
}, {timestamps: true});

const Doctor = mongoose.model('Doctor', doctorSchema, 'Doctors');
module.exports = Doctor;