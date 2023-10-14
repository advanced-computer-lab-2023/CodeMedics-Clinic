const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctorUserName: {
        type: String,
        required: true
    },
    patientUserName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startHour:{
        type: Number,
        required: true
    },
    endHour:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    }
} , {timestamps: true});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'Appointments');
module.exports = Appointment;
