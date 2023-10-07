const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    Name: {
        type: String,
        required: [true, 'Please enter a first name']
    },
    Price: {
        type: String,
        required: [true, 'Please enter a last name']
    },
    SessionDiscount: {
        type: String,
        required: [true, 'Please enter a username']
    },
    MedicinDiscount: {
        type: String,
        required: [true, 'Please enter a password']
    },
    FamilyDiscount: {
        type: String,
        required: [true, 'Please enter an email']
    },
}, {timestamps: true});

const Doctor = mongoose.model('Doctors', doctorSchema, 'Doctors');
module.exports = Doctor;