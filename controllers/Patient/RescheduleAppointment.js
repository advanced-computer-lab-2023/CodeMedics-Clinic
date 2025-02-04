const express = require('express');
const router = express.Router();
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const nodemailer = require('nodemailer');

exports.RescheduleAppointment = async (req, res) => {
    try {
        const { appointmentID, oldAppointmentID, username } = req.query;
        console.log("in reschedule appointment");
        console.log(appointmentID, oldAppointmentID, username);
        const patient = await Patient.findOne({ Username: username });
        const appointment = await Appointment.findOne({ _id: appointmentID });
        const oldAppointment = await Appointment.findOne({ _id: oldAppointmentID });
        // console.log(patient, appointment, oldAppointment);
        // console.log(patient.Appointments);
        patient.Appointments = patient.Appointments.filter(item => item != oldAppointmentID);
        patient.Appointments.push(appointmentID);
        // console.log(patient.Appointments);
        appointment.patient = oldAppointment.patient;
        appointment.status = "rescheduled";
        oldAppointment.patient = null;
        oldAppointment.status = "unreserved";
        // console.log(appointment, oldAppointment, patient);
        await appointment.save();
        await oldAppointment.save();
        await patient.save();

        const doctor = await Doctor.findOne({ Username: appointment.doctorUsername });
        if (!doctor) {
            return res.status(400).json({ message: 'Doctor not found' });
        }

        // Notify both doctor and patient
        sendEmail(doctor.Email, 'Appointment Update', `Your appointment with your patient ${patient.FirstName} ${patient.LastName} has been rescheduled to be on ${appointment.date} from ${appointment.startHour} to  ${appointment.endHour}.`);
        // Generate success message
        const doctorMessage = `Your appointment with your patient ${patient.FirstName} ${patient.LastName} has been rescheduled to be on ${appointment.date} from ${appointment.startHour} to  ${appointment.endHour}.`;

        // Add the success message to the doctor's messages list
        doctor.Messages.push({
            sender: 'System',
            content: doctorMessage,
            timestamp: new Date(),
        });
        await doctor.save();

        sendEmail(patient.Email, 'Appointment Update', `Your appointment with your Doctor ${doctor.FirstName} ${doctor.LastName} has been rescheduled to be on ${appointment.date} from ${appointment.startHour} to  ${appointment.endHour}.`);
        // Generate success message
        const successMessage = `Your appointment with your Doctor ${doctor.FirstName} ${doctor.LastName} has been rescheduled to be on ${appointment.date} from ${appointment.startHour} to  ${appointment.endHour}.`;

        // Add the success message to the patient's messages list
        patient.Messages.push({
            sender: 'System',
            content: successMessage,
            timestamp: new Date(),
        });
        await patient.save();
        res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
    } catch (error) {
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
