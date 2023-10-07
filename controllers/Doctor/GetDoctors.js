const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor'); 

// Get all available doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

