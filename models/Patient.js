const mongoose = require('mongoose');
const Prescription = require('./Prescription');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
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
    NationalID: {
        type: String,
        required: [true, 'Please enter a national ID']
    },
    DateOfBirth: {
        type: String,
        required: false
    },
    Number: {
        type: String,
        required: false
    },
    Gender: {
        type: String,
        required: true,
    },
    Prescriptions: {
        type: [Prescription.schema],
        required: false
    },
    EmergencyContacts: {
        type: {String, String},
        required: false
    },
    FamilyMembers: {
        type: [Schema.Types.ObjectId],
        ref: 'FamilyMember',
    },
    Appointments:{
        type: [String],
        required: false
    },
    HealthPackage:{
        type: {
            Name: String,
            membership: String, // Free, Silver, Gold, Platinum
            status: String, // Subscribed, Unsubscribed
            Price: Number,
            date: Date
        },
        default: {
            membership: "Free",
            status: "Not Subscribed",
            date: Date.now()
        },
        required: false
    },
    Wallet:{
        type: Number,
        default: 0,
        required: false
    },
}, {timestamps: true});

const Patient = mongoose.model('Patient', patientSchema, 'Patients');
module.exports = Patient;