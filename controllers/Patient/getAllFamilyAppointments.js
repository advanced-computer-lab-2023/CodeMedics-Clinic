const express = require("express");
const router = express.Router();
const Patient = require("../../models/Patient");
const Appointment = require("../../models/Appointment");
const { getUsername } = require("../../config/infoGetter");
const { validatePatient } = require("../../utils/validator");

exports.getAllFamilyAppointments = async (req, res) => {
  try {
    const { patientUsername } = req.params;
    const patient = validatePatient(patientUsername, res);
    let familyUsernames = patient.familyMembers.map((item) => item.username);
    familyUsernames.push(patientUsername);
    const appointments = await Appointment.find({
      _id: { $in: familyUsernames },
    });
    return res.status(200).json({ data: appointments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
