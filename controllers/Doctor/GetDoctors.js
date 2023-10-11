const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Package = require('../../models/Package');

// Get all available doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDoctorsAndSpecialties = async (req, res) => {
  try{
    const {Username} = req.body;
    const patient = await Patient.findOne({Username});
    const doctors = await Doctor.find();
    const package = await Package.findOne({Name: patient.Package});
    const data = [];
    for(let i=0; i<doctors.length ;i++){
      let price = doctors[i].HourlyRate + 0.1 * doctors[i].HourlyRate;
      if(package != null){
        price -= price * (package.SessionDiscount / 100);
      }
      data.push({doctor: doctors[i], price: price});
    }
    res.status(200).json({data: data});
  }catch(error){
    res.status(500).json({ message: error.message });
  }
};