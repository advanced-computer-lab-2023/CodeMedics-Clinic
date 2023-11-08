const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin'],
    default: 'Patient',
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
