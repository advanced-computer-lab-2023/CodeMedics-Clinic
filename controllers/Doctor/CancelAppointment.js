const express = require('express');
const router = express.Router();
const Appointments = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Package = require('../../models/Package');
const ClinicWallet = require('../../models/ClinicWallet');
const nodemailer = require('nodemailer');


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
exports.CancelAppointment = async (req, res) => {
    try{
        const { appointmentID } = req.query;
        console.log("IN CANCEL APPOINTMENT", appointmentID);
        const appointment = await Appointments.findOne({_id: appointmentID});
        const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
        const patient = await Patient.findOne({Username: appointment.patient});
        const package = await Package.findOne({ Name: patient.HealthPackage.membership });
        let clinicWallet = await ClinicWallet.find();
        clinicWallet = clinicWallet[0];
        var discount = 0;
        if(package){
            discount = package.SessionDiscount;
        }
        const clinicFees = doctor.HourlyRate * 0.1;
        const hours = Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour));
        const appointmentPrice = hours * (doctor.HourlyRate + clinicFees);
        doctor.Wallet = doctor.Wallet - hours * doctor.HourlyRate; // handle case that the wallet is initially empty ... or maybe it's a feature :)
        patient.Wallet += appointmentPrice - (appointmentPrice * discount / 100); //TODO handle correct calculation
        clinicWallet.Wallet -= clinicFees;
        appointment.status = 'cancelled';
        await clinicWallet.save();
        await doctor.save();
        await patient.save();
        await appointment.save();
        
        
        // Notify both doctor and patient
        sendEmail(doctor.Email, 'Appointment Cancelled', `Your appointment on ${appointment.date} has been canceled.`);
        // Generate success message
const doctorMessage = `Your appointment on ${appointment.date} has been canceled.`;

// Add the success message to the doctor's messages list
doctor.Messages.push({
    sender: 'System',
    content: doctorMessage,
    timestamp: new Date(),
});
await doctor.save();

        sendEmail(patient.Email, 'Appointment Cancelled', `Your appointment on ${appointment.date} has been canceled.`);
  // Generate success message
  const successMessage = `Your appointment on ${appointment.date} has been canceled.`;

  // Add the success message to the patient's messages list
  patient.Messages.push({
      sender: 'System',
      content: successMessage,
      timestamp: new Date(),
  });
  await patient.save();
        res.status(200).json({message: 'Appointment Cancelled Successfully'});

    }catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Something Wrong Happened while Cancelling'})
    }
};

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