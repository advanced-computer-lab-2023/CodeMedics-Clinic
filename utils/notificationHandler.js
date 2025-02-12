const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "codemedics2@gmail.com",
    pass: "wwtv oszi mcju tilf",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail(recipient, subject, message) {
  try {
    const mailOptions = {
      from: "codemedics2@gmail.com", // Replace with your Gmail email
      to: recipient,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

async function sendNotification(user, emailSubject, emailContent) {
  await sendEmail(user.email, emailSubject, emailContent);
  user.messages.push({
    sender: "System",
    content: successMessage,
    timestamp: new Date(),
  });
  await user.save();
}

async function handlePatientAppointmentNotification(
  patient,
  appointment,
  isRequested,
  doctor
) {
  const emailSubject =
    isRequested === "true" ? "Follow-up Scheduled" : "Appointment Confirmation";
  const emailContent =
    isRequested === "true"
      ? `Doctor ${doctor.firstName} ${doctor.lastName} has scheduled a Follow-up to you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`
      : `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

  const successMessage =
    isRequested === "true"
      ? `Your Follow-up Request has been accepted to be on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`
      : `Your appointment has been booked successfully on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;

  await sendNotification(patient, emailSubject, emailContent, successMessage);
}

async function handleDoctorAppointmentNotification(doctor, patient, appointment) {
  const emailContent = `Patient ${patient.firstName} ${patient.lastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;
  const doctorMessage = `Patient ${patient.firstName} ${patient.lastName} has booked an appointment with you on ${appointment.date} from ${appointment.startHour} to ${appointment.endHour}.`;
  await sendNotification(
    doctor,
    "New Appointment Booking",
    emailContent,
    doctorMessage
  );
}

module.exports = { sendEmail, handleDoctorAppointmentNotification, handlePatientAppointmentNotification };
