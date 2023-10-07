const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    DateOfBirth:{
        type: Date,
        required: true
    },
    HourlyRate:{
        type: Number,
        required: true
    },
    Affiliation:{
        type: String,
        required: true
    },
    EductionalBackground:{
        type: String,
        required: true
    },
    
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;