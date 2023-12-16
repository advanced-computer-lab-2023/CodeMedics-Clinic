const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const { getUsername } = require('../../config/infoGetter');
const nodemailer = require('nodemailer');

exports.rescheduleAppointment = async (req, res) => {
    try {
        const patientUsername = req.params.patientUsername; // Extract patient username from URL
        const { appointmentId, startHour, endHour, date } = req.body;
        console.log("INSIDE RESCHEDULE APPOINTMENT BACKEND");
        
        const doctorUsername = await getUsername(req, res);

        // Find the existing appointment for the patient, doctor, and appointment ID
        const existingAppointment = await Appointment.findOne({
            _id: appointmentId,
            doctorUsername,
            //patient: patientUsername,
            status: { $in: ['upcoming', 'rescheduled'] }
        });

        if (!existingAppointment) {
            return res.status(400).json({ message: "No valid appointment found for rescheduling" });
        }

        // Update the existing appointment details
        existingAppointment.date = date.split('T')[0];
        existingAppointment.startHour = startHour.substring(0, 2);
        existingAppointment.endHour = endHour.substring(0, 2);
        existingAppointment.status = 'rescheduled';

        await existingAppointment.save();
        const patient = await Patient.findOne({ Username: patientUsername });
        if (!patient) {
            return res.status(400).json({ message: 'Patient not found' });
        }
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        if (!doctor) {
            return res.status(400).json({ message: 'Doctor not found' });
        }

        // Notify both doctor and patient
        sendEmail(doctor.Email, 'Appointment Update', `Your appointment with your patient ${patient.FirstName} ${patient.LastName} has been rescheduled to be on ${existingAppointment.date} from ${existingAppointment.startHour} to ${existingAppointment.endHour}.`);
        // Generate success message
const doctorMessage = `Your appointment with your patient ${patient.FirstName} ${patient.LastName} has been rescheduled to be on ${existingAppointment.date} from ${existingAppointment.startHour} to ${existingAppointment.endHour}.`;

// Add the success message to the doctor's messages list
doctor.Messages.push({
    sender: 'System',
    content: doctorMessage,
    timestamp: new Date(),
});
await doctor.save();

        sendEmail(patient.Email, 'Appointment Update', `Your appointment with your Doctor ${doctor.FirstName} ${doctor.LastName} has been rescheduled to be on ${existingAppointment.date} from ${existingAppointment.startHour} to ${existingAppointment.endHour}.`);
  // Generate success message
  const successMessage = `Your appointment with your Doctor ${doctor.FirstName} ${doctor.LastName} has been rescheduled to be on ${existingAppointment.date} from ${existingAppointment.startHour} to ${existingAppointment.endHour}.`;

  // Add the success message to the patient's messages list
  patient.Messages.push({
      sender: 'System',
      content: successMessage,
      timestamp: new Date(),
  });
  await patient.save();

        res.status(200).json({ message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


// Nodemailer setup and sendEmail function
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'codemedics2@gmail.com',
        pass: 'wwtv oszi mcju tilf',
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendEmail(recipient, subject, message) {
    try {
        const mailOptions = {
            from: 'codemedics2@gmail.com', // Replace with your Gmail email
            to: recipient,
            subject: subject,
            text: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
