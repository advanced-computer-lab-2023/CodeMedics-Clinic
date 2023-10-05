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
    },
    Password: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;