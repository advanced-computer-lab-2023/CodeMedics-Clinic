const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription');      

// Get all prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Filter prescriptions by date
exports.getPrescriptionsByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const prescriptions = await Prescription.find({ date });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Filter prescriptions by doctor
exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const prescriptions = await Prescription.find({ doctor: doctorId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Filter prescriptions by filled status (true or false)
exports.getPrescriptionsByStatus = async (req, res) => {
  try {
    const { filledStatus } = req.body;
    const prescriptions = await Prescription.find({ filled: filledStatus });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


