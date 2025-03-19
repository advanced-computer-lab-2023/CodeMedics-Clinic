const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    email: {
        type: String,
        required: false,
    },
    isCreator: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema, 'Admins');
module.exports = Admin;