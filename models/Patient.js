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
        required: [true, 'Please enter a Date of Birth']
    },
    Number: {
        type: Number,
        required: [true, 'Please enter a phone number']
    },
    Package: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;