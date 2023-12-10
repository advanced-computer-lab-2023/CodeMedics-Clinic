const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Prescription = require('../../models/Prescription');
const { getUsername } = require('../../config/infoGetter');

exports.addPrescription = async (req, res) => {
  try {
    const doctorUsername = await getUsername(req, res);

    if (!doctorUsername) {
      return res.status(401).json({ message: 'Authentication error: Doctor not logged in.' });
    }

    const { drugs, patientUsername, date, filledStatus } = req.body;

    if (!patientUsername || !drugs || !date) {
      return res.status(400).json({ message: 'Incomplete data for prescription' });
    }

    const patient = await Patient.findOne({ Username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newPrescription = new Prescription({
      Drug: drugs,
      Doctor: doctorUsername,
      Patient: patientUsername,
      Date: date,
      filled: filledStatus || false,
    });

    await newPrescription.save();

    patient.Prescriptions.push(newPrescription);
    await patient.save();

    res.status(201).json({ message: 'Prescription added successfully', prescription: newPrescription });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
