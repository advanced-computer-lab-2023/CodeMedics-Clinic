const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    drug: [{
        drugName: {
            type: String,
            required: [true, 'Please enter a drug name']
        },
        dosage: {
            type: String,
            required: [false, 'Please enter a dosage']
        }
    }],
    doctorUsername: {
        type: String,
        required: [true, 'Please enter a doctor']
    },
    patientUsername: {
        type: String,
        required: [true, 'Please enter a patient']
    },
    date: {
        type: String,
        required: [true, 'Please enter a date']
    },
    filled: {   
        type: Boolean,
        default: false,
        required: [false, 'Please enter a filled status']
    }
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema, 'Prescriptions');
module.exports = Prescription;
