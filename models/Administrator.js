const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    Name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    Username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    Password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    Email: {
        type: String,
        required: [true, 'Please enter an email']
    },

}, {timestamps: true});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;