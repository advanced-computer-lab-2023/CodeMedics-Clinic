const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Package = require('../../models/Package');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');

// Get all available doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoctorsAndAppointments = async (req, res) => {
  try {
    const Username = await getUsername(req, res);
    const patient = await Patient.findOne({ Username });
    if (patient == null) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const doctors = await Doctor.find({Status : "Approved"});
    const package = await Package.findOne({ Name: patient.HealthPackage.membership });
    const data = [];
    for (let i = 0; i < doctors.length; i++) {
      let price = doctors[i].HourlyRate + 0.1 * doctors[i].HourlyRate;
      if (package != null) {
        price -= price * (package.SessionDiscount / 100);
        doctors[i]['Price'] = price;
      }
      let appointments = [];
      for (let j = 0; j < doctors[i].Appointments.length; j++) {
        const appointment = await Appointment.findOne({ _id: doctors[i].Appointments[j] });
        if (appointment && appointment.status == "unreserved") {
          appointments.push(appointment);
        }
      }
      data.push({"doctor": doctors[i] , "price": price , "appointments": appointments});
    }
    console.log('here >>> 4');
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};