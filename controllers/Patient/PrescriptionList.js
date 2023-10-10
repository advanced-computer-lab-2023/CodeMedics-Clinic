const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription');      

// Get all prescriptions for a patient
exports.getPrescriptions = async (req, res) => {
  try {
    const { userName } = req.body;
    
    const prescriptions = await Prescription.find({ 
      Patient: userName 
    });
    //console.log(prescriptions);

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Filter prescriptions by date
exports.getPrescriptionsByDate = async (req, res) => {
  try {
    const { userName, date } = req.body;

    const prescriptions = await Prescription.find({
      Patient: userName,
      Date: date,
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Filter prescriptions by doctor
exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { userName, doctor } = req.body;

    console.log('userName:', userName);
    console.log('doctor:', doctor);

    const prescriptions = await Prescription.find({ 
      Patient: userName, 
      Doctor: doctor 
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Filter prescriptions by filled status (true or false)
exports.getPrescriptionsByStatus = async (req, res) => {
  try {
    const { userName ,filledStatus } = req.body;
    
    const prescriptions = await Prescription.find({ 
      Patient: userName, 
      filled: filledStatus 
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


