const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");
const Patient = require("../../models/Patient");
const Package = require("../../models/Package");
const ClinicWallet = require("../../models/ClinicWallet");
const { sendNotification } = require("../../utils/notificationHandler");
const {
  validateAppointment,
  validateDoctor,
  validatePatient,
} = require("../../utils/validator");

const cancelWithin24Hours = async (appointment) => {
  appointment.status = "cancelled";
  await appointment.save();
};

const cancelBeyond24Hours = async (appointment) => {
  const doctor = await Doctor.findOne({ username: appointment.doctorUsername });
  const patient = await Patient.findOne({
    username: appointment.patientUsername,
  });
  const package = await Package.findOne({ name: patient.healthPackage.name });
  let clinicWallet = await ClinicWallet.find();
  clinicWallet = clinicWallet[0];

  if (!doctor || !patient) {
    throw new Error("Doctor or patient not found");
  }

  const discount = package ? package.sessionDiscount : 0;
  const hours = Math.abs(
    parseInt(appointment.startHour) - parseInt(appointment.endHour)
  );
  const clinicFees = 0.1 * doctor.hourlyRate;
  const appointmentPrice = hours * (doctor.hourlyRate + clinicFees);

  // Update wallets
  doctor.wallet -= hours * doctor.hourlyRate;
  patient.wallet += appointmentPrice - (appointmentPrice * discount) / 100;
  clinicWallet.wallet -= clinicFees;

  // Create a new unreserved appointment
  const unreservedAppointment = new Appointment({
    doctor: doctor.firstName + doctor.lastName,
    doctorUsername: doctor.username,
    patientUsername: null,
    date: appointment.date,
    startHour: appointment.startHour,
    endHour: appointment.endHour,
    status: "unreserved",
  });
  await unreservedAppointment.save();

  await doctor.save();
  await patient.save();
  await clinicWallet.save();

  appointment.status = "cancelled";
  await appointment.save();
};

exports.CancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await validateAppointment(appointmentId, res);
    const currentDate = new Date();
    const appointmentDate = new Date(appointment.date);

    if (Math.abs(currentDate - appointmentDate) < 24 * 60 * 60 * 1000) {
      await cancelWithin24Hours(appointment);
    } else {
      await cancelBeyond24Hours(appointment);
    }

    const doctor = await validateDoctor(appointment.doctorUsername, res);
    const patient = await validatePatient(appointment.patientUsername, res);

    const notificationMessage = `Your appointment on ${appointment.date} has been canceled.`;
    await sendNotification(
      doctor,
      "Appointment Cancelled",
      notificationMessage,
      notificationMessage
    );
    await sendNotification(
      patient,
      "Appointment Cancelled",
      notificationMessage,
      notificationMessage
    );

    res.status(204).json({ message: "Appointment Canceled Successfully" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: error.message });
  }
};
