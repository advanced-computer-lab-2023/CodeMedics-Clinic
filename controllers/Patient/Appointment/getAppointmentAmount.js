const express = require("express");
const router = express.Router();
const Doctor = require("../../../models/Doctor");
const Appointment = require("../../../models/Appointment");
const Patient = require("../../../models/Patient");

exports.getAppointmentAmount = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ _id: appointmentId });
    const doctor = await Doctor.findOne({ username: appointment.doctorUsername });
    console.log(appointment, doctor)
    const amount =
      (appointment.endHour - appointment.startHour) * doctor.hourlyRate;
    res.status(200).json({ data: amount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
