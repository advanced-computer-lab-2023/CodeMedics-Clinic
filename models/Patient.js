const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
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
    },
    FamilyMembers:{
        type: [Schema.Types.ObjectId],
        ref: 'FamilyMember',
    },
    
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;