const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    Drug: {
        type: {String, Number},
        required: [true, 'Please enter a dosage']
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
        type: Date,
        required: [true, 'Please enter a date']
    },
    filled: {   
        type: Boolean,
        required: [true, 'Please enter a filled status']
    }
}, {timestamps: true});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;

    