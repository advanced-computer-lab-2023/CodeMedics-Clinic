const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

exports.getPatientDoctorAppointments = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const { status } = req.query;
    var appointments = await Appointment.find({ doctorUsername: doctorUsername });
    if (status) {
      appointments = appointments.filter(appointment => appointment.status == status );
    }
    res.status(200).json({ data: appointments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
