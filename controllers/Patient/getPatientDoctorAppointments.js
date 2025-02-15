const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

exports.getPatientDoctorAppointments = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const { status } = req.query;
    const query = { doctorUsername: doctorUsername };
    if (status) {
      const statusArray = Array.isArray(status) ? status : status.split(",");
      query.status = { $in: statusArray };
    }
    let appointments = await Appointment.find(query).sort({ date: 1 }).lean();
    res.status(200).json({ data: appointments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
