const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctorUsername: {
        type: String,
        required: true
    },
    patientUsername: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    startHour: {
        type: Number,
        required: true
    },
    endHour: {
        type: Number,
        required: true
    },
    isFollowUp: {
        type: Boolean,
        required: false
    },
    status: {
        type: String,
        enum: ['unreserved', 'upcoming', 'completed', 'cancelled', 'rescheduled', 'follow-up Requested', 'followUpAccepted', 'followUpRevoked'],
        default: 'unreserved',
        required: true
    }
}, {timestamps: true});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'Appointments');
module.exports = Appointment;
