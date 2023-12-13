const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription');
const doctorSchema = require('../../models/Doctor');
const { getUsername } = require('../../config/infoGetter');
exports.getPrescriptions = async (req, res) => {
    try {
      const Username = await getUsername(req, res);
  
      
      const prescriptions = await Prescription.find({ 
        Doctor: Username 
      });
  
      res.status(200).json(prescriptions);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

 