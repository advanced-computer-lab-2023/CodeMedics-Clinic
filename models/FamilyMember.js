const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    nationalId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    }
}, { timestamps: true });

const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema, "FamilyMember");
module.exports = FamilyMember;