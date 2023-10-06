const mongoose = require('mongoose');
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
    DateOfBirth: {
        type: Date,
        required: false
    },
    Number: {
        type: Number,
        required: false
    },
    Gender: {
        type: String,
        required: true,
    },
    Package: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Patient = mongoose.model('Patients', patientSchema, 'Patients');
module.exports = Patient;