const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    Drug: {
        type: String,
        required: [true, 'Please enter a drug and dosage']
    },
    Doctor: {
        type: String,
        required: [true, 'Please enter a doctor']
    },
    Patient: {
        type: String,
        required: [true, 'Please enter a patient']
    },
    Date: {
        type: String,
        required: [true, 'Please enter a date']
    },
    filled: {   
        type: Boolean,
        required: [true, 'Please enter a filled status']
    }
}, {timestamps: true});

const Prescription = mongoose.model('Prescription', prescriptionSchema, 'Prescriptions');
module.exports = Prescription;

    