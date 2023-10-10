const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    Name: {
        type: String,
        required: [true, 'Please enter a Name']
    },
    Price: {
        type: Number,
        required: [true, 'Please enter a Price']
    },
    SessionDiscount: {
        type: Number,
        required: [true, 'Please enter a SessionDiscount']
    },
    MedicineDiscount: {
        type: Number,
        required: [true, 'Please enter a MedicineDiscount']
    },
    FamilyDiscount: {
        type: Number,
        required: [true, 'Please enter a FamilyDiscount']
    },
}, {timestamps: true});

const Package = mongoose.model('Package', packageSchema, 'Package');
module.exports = Package;