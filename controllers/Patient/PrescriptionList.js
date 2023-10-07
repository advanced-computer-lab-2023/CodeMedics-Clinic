const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription');      

// Get all prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Filter prescriptions by date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const prescriptions = await Prescription.find({ date });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Filter prescriptions by doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const prescriptions = await Prescription.find({ doctor: doctorId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Filter prescriptions by filled status (true or false)
router.get('/filled/:filledStatus', async (req, res) => {
  try {
    const { filledStatus } = req.params;
    const prescriptions = await Prescription.find({ filled: filledStatus });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

