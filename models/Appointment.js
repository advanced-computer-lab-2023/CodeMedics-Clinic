const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctor: {
        type: String,
        required: true
    },
    doctorUsername: {
        type: String,
        required: true
    },
    patient: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    startHour:{
        type: String,
        required: true
    },
    endHour:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['unreserved', 'upcoming', 'completed', 'cancelled', 'rescheduled'],
        default: 'unreserved', 
        required: true }
} , {timestamps: true});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'Appointments');
module.exports = Appointment;
