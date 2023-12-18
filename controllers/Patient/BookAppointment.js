const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const packageModel = require('../../models/Package');
const ClinicWallet = require('../../models/ClinicWallet');
const nodemailer = require('nodemailer');
const {getUsername} = require('../../config/infoGetter');

exports.bookAppointment = async (req, res) => {
    try {
        const { appointmentId, patientUsername, isRequested } = req.query;
        const appointment = await Appointment.findOne({ _id: appointmentId });
        console.log("in the book appointment");
        console.log(appointmentId, patientUsername, isRequested);
        // console.log(appointmentId, appointment);
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' });
        }

        if (appointment.status !== 'unreserved') {
            return res.status(400).json({ message: 'Appointment cannot be booked. Status is not unreserved.' });
        }

        const patient = await Patient.findOne({ Username: patientUsername });
        if (!patient) {
            return res.status(400).json({ message: 'Patient not found' });
        }
        // console.log(patient);
        // console.log(appointment);
        // Update appointment details
        appointment.patient = patientUsername;
        appointment.status = 'upcoming';
        if(isRequested == 'true'){
            appointment.isFollowUp = true;
        }
        await appointment.save();

        // Update patient's appointments
        patient.Appointments.push(appointmentId);
        await patient.save();

        // Update doctor's patients list
        const doctor = await Doctor.findOne({ Username: appointment.doctorUsername });
        if (!doctor) {
            return res.status(400).json({ message: 'Doctor not found' });
        }

        if (!doctor.Patients.includes(patient._id)) {
            doctor.Patients.push(patient._id);
        }

        await doctor.save();

        // Send email notification to patient
        if(isRequested == 'true'){
            sendEmail(patient.Email, 'Follow-up Scheduled', `Doctor ${doctor.FirstName + " " + doctor.LastName} has scheduled a Follow-up to you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`);
        }
        else
            sendEmail(patient.Email, 'Appointment Confirmation', `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`);
// Generate success message
const successMessage = isRequested == 'true' ? `Your Follow-up Request has been accepted to be on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.` : `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

// Add the success message to the patient's messages list
patient.Messages.push({
    sender: 'System',
    content: successMessage,
    timestamp: new Date(),
});
await patient.save();
        // Send email notification to doctor
        if(isRequested == 'true'){
            res.status(200).json({ message: 'Follow-up Request accepted successfully' });
            return;
        }
        sendEmail(doctor.Email, 'New Appointment Booking', `Patient ${patient.FirstName} ${patient.LastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`);

        // Generate success message
const doctorMessage = `Patient ${patient.FirstName} ${patient.LastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

// Add the success message to the doctor's messages list
doctor.Messages.push({
    sender: 'System',
    content: doctorMessage,
    timestamp: new Date(),
});
await doctor.save();

        // Response to the patient with appointment details
        res.status(200).json({
            message: 'Appointment booked successfully',
            appointmentDetails: {
                id: appointment._id,
                doctorName: `${appointment.doctor.FirstName} ${appointment.doctor.LastName}`,
                patientName: `${patient.FirstName} ${patient.LastName}`,
                date: appointment.date,
                startHour: appointment.startHour,
                endHour: appointment.endHour,
                status: appointment.status,
            },
        });
    } catch (error) {
        console.log("in the book appointment error");
        res.status(400).json({ message: error.message });
    }
};


exports.payWithWallet = async (req, res) => {
    try {
        const temp = req.body.username;
        const Username = temp ? temp : await getUsername(req, res);
        const { AppointmentId } = req.body;
        console.log("in the pay with wallet", temp, Username);
        if (!AppointmentId) {
            return res.status(400).json({ message: "Appointment ID not found" });
        }
        const appointment = await Appointment.findOne({ _id: AppointmentId });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const doctor = await Doctor.findOne({ Username: appointment.doctorUsername });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const patient = await Patient.findOne({ Username });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const package = await packageModel.findOne({ Name: patient.HealthPackage.membership });
        let price = doctor.HourlyRate + 0.1 * doctor.HourlyRate;
        let clinicWallet = await ClinicWallet.find();
        clinicWallet = clinicWallet[0];
        
        const hours = Math.abs(parseInt(appointment.startHour) - parseInt(appointment.endHour));
        price *= hours;
        if (package != null) {
            price -= price * (package.SessionDiscount / 100);
        }
        if (patient.Wallet < price) {
            return res.status(400).json({ message: "Insufficient funds" });
        }
        patient.Wallet -= price;
        doctor.Wallet += hours * doctor.HourlyRate;
        clinicWallet.Wallet += 0.1 * doctor.HourlyRate;
        if(!patient.Appointments.includes(appointment._id)){
            patient.Appointments.push(appointment._id);
        }
        await patient.save();
        appointment.patient = Username;
        appointment.status = "upcoming";
        await appointment.save();
        if(!doctor.Appointments.includes(appointment._id)){
            doctor.Appointments.push(appointment._id);
        }
        if(!doctor.Patients.includes(patient._id)){
            doctor.Patients.push(patient._id);
        }
        await doctor.save();
        await clinicWallet.save();

        // Send email notification to patient
        sendEmail(patient.Email, 'Appointment Confirmation', `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`);
        // Generate success message
        const successMessage = `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

        // Add the success message to the patient's messages list
        patient.Messages.push({
            sender: 'System',
            content: successMessage,
            timestamp: new Date(),
        });
        await patient.save();
        // Send email notification to doctor
        sendEmail(doctor.Email, 'New Appointment Booking', `Patient ${patient.FirstName} ${patient.LastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`);

        // Generate success message
        const doctorMessage = `Patient ${patient.FirstName} ${patient.LastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

        // Add the success message to the doctor's messages list
        doctor.Messages.push({
            sender: 'System',
            content: doctorMessage,
            timestamp: new Date(),
        });
        await doctor.save();

        // Response to the patient with appointment details
        res.status(200).json({
            message: 'Appointment booked successfully',
            appointmentDetails: {
                id: appointment._id,
                doctorName: `${appointment.doctor.FirstName} ${appointment.doctor.LastName}`,
                patientName: `${patient.FirstName} ${patient.LastName}`,
                date: appointment.date,
                startHour: appointment.startHour,
                endHour: appointment.endHour,
                status: appointment.status,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
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
