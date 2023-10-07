const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    NationalID:{
        type: String,
        required: true
    },
    Gender:{
        type: String,
        required: true
    },
    DateOfBirth:{
        type: Date,
        required: true
    },
}, { timestamps: true });

const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
module.exports = FamilyMember;