const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");
const Package = require("../../models/Package");
const Appointment = require("../../models/Appointment");
const { getUsername } = require("../../config/infoGetter");
const { validatePatient } = require("../../utils/validator");

// Get all available doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorsAndAppointments = async (req, res) => {
  try {
    const {patientUsername} = req.params;
    const patient = await validatePatient(patientUsername, res);
    const doctors = await Doctor.find({ status: "approved" });
    const package = await Package.findOne({
      name: patient.healthPackage.name,
    });
    const data = [];
    for (let i = 0; i < doctors.length; i++) {
      let price = doctors[i].hourlyRate + 0.1 * doctors[i].hourlyRate;
      if (package != null) {
        price -= price * (package.sessionDiscount / 100);
        doctors[i]["price"] = price;
      }
      let appointments = await Appointment.find({status: "unreserved", doctorUsername: doctors[i].username})
      data.push({
        doctor: doctors[i],
        price: price,
        appointments: appointments,
      });
    }

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
