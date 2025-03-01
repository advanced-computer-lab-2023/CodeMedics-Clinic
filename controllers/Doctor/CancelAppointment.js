const ClinicWallet = require("../../models/ClinicWallet");
const {
  sendEmail,
  sendNotification,
} = require("../../utils/notificationHandler");
const {
  validateAppointment,
  validatePatient,
  validatePackage,
  validateDoctor,
} = require("../../utils/validator");

exports.CancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log("IN CANCEL APPOINTMENT", appointmentId);
    const appointment = await validateAppointment(appointmentId, res);
    const doctor = await validateDoctor(appointment.doctorUsername, res);
    const patient = await validatePatient(appointment.patientUsername, res);
    const package = await validatePackage(patient.healthPackage.name);
    let clinicWallet = await ClinicWallet.find();
    clinicWallet = clinicWallet[0];
    let discount = 0;
    if (package) {
      discount = package.sessionDiscount;
    }
    const clinicFees = doctor.hourlyRate * 0.1;
    const hours = Math.abs(
      parseInt(appointment.startHour) - parseInt(appointment.endHour)
    );
    const appointmentPrice = hours * (doctor.hourlyRate + clinicFees);
    doctor.wallet = doctor.wallet - hours * doctor.hourlyRate;
    patient.wallet += appointmentPrice - (appointmentPrice * discount) / 100;
    clinicWallet.wallet -= clinicFees;
    appointment.status = "cancelled";
    await clinicWallet.save();
    await doctor.save();
    await patient.save();
    await appointment.save();

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

    res.status(204).json({ message: "Appointment Cancelled Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Wrong Happened while Cancelling" });
  }
};
