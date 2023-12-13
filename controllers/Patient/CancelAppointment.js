
const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const nodemailer = require('nodemailer');


async function sendEmail(recipient, subject, message) {
    try {
        const mailOptions = {
            from: 'mirnahaitham2@gmail.com', // Replace with your Gmail email
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

exports.CancelAppointment = async (req, res) => {
    try {
        const { appointmentID } = req.query;

        if (!appointmentID) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findOne({ _id: appointmentID });

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const currentDate = new Date();
        const appointmentDate = new Date(appointment.date);

        if (Math.abs(currentDate - appointmentDate) < 24 * 60 * 60 * 1000) {
            // Cancellation within 24 hours
            appointment.status = 'cancelled';
            await appointment.save();
        } else {
            // Cancellation beyond 24 hours
            const doctor = await Doctor.findOne({ Username: appointment.doctorUsername });
            const patient = await Patient.findOne({ Username: appointment.patient });
            if (!doctor || !patient) {
                return res.status(404).json({ success: false, message: 'Doctor or patient not found' });
            }

            const appointmentPrice = (Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour))) * doctor.HourlyRate;
            doctor.Wallet -= appointmentPrice;
            patient.Wallet += appointmentPrice;
            await doctor.save();
            await patient.save();
            appointment.status = 'unreserved';
            await appointment.save();
        

        // Notify both doctor and patient
        sendEmail(doctor.Email, 'Appointment Update', `Your appointment on ${appointment.date} has been canceled or rescheduled.`);
        // Generate success message
const doctorMessage = `Your appointment on ${appointment.date} has been canceled or rescheduled.`;

// Add the success message to the doctor's messages list
doctor.Messages.push({
    sender: 'System',
    content: doctorMessage,
    timestamp: new Date(),
});
await doctor.save();

        sendEmail(patient.Email, 'Appointment Update', `Your appointment on ${appointment.date} has been canceled or rescheduled.`);
  // Generate success message
  const successMessage = `Your appointment on ${appointment.date} has been canceled or rescheduled.`;

  // Add the success message to the patient's messages list
  patient.Messages.push({
      sender: 'System',
      content: successMessage,
      timestamp: new Date(),
  });
  await patient.save();
  
        res.status(200).json({ success: true, message: 'Appointment Canceled Successfully' });}
    } catch (error) {
        console.error('Error canceling appointment:', error);
        return res.status(500).json({ success: false, message: 'Something went wrong while canceling the appointment' });
    }
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mirnahaitham2@gmail.com',
        pass: 'dygc irfq totb kuzy',
    },
    tls: {
        rejectUnauthorized: false
    }
});
