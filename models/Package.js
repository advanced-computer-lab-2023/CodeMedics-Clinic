const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    price: {
        type: Number,
        required: [true, 'Please enter a price']
    },
    sessionDiscount: {
        type: Number,
        required: [true, 'Please enter a session discount']
    },
    medicineDiscount: {
        type: Number,
        required: [true, 'Please enter a medicine discount']
    },
    familyDiscount: {
        type: Number,
        required: [true, 'Please enter a family discount']
    },
}, {timestamps: true});

const Package = mongoose.model('Package', packageSchema, 'Package');
module.exports = Package;
