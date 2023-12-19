const mongoose = require('mongoose');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const express = require('express');
const { getUsername } = require('../../config/infoGetter');

exports.viewPatients = async (req, res) => {
    try {
        const username = await getUsername(req, res);

        if (!username) return res.status(401).json({ message: "You are not logged in." })
        const doctor = await Doctor.findOne({ Username: username });
        if (!doctor) return res.status(401).json({ message: "Doctor not found." })
        const patients = [];
        if (doctor.Patients == null) return res.status(200).json({ patients });
        for (var i = 0; i < doctor.Patients.length; i++) {
            const patient = await Patient.findOne({ _id: doctor.Patients[i] });
            if (patient) {
                const appointment = await Appointment.findOne({ patient: patient.Username, status: 'upcoming' });       
                if (appointment) {
                    patients.push({ patient, upcoming: true })
                }
                else {
                    patients.push({     patient, upcoming: false });
                }
            }
        }
        return res.status(200).json({ patients });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getPatientByUsername = async (req, res) => {
    const username = req.query.username;
    console.log(username);
    try {
        const patient = await Patient.findOne({ Username: username });
        console.log("TESTING GetPatientByUsername", patient);
        return res.status(200).json(patient);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};