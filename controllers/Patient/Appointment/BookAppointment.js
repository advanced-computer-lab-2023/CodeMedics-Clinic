const {
  handleDoctorAppointmentNotification,
  handlePatientAppointmentNotification,
} = require("../../../utils/notificationHandler");

const {
  validatePatient,
  validateAppointment,
  validateDoctor,
} = require("../../../utils/validator");

exports.bookAppointment = async (req, res) => {
  try {
    const { appointmentId, patientUsername } = req.params;
    const { isRequested } = req.body;
    const appointment = await validateAppointment(appointmentId, res);
    if (appointment.status !== "unreserved") {
      res.status(400).json({
        message: "Appointment cannot be booked. Status is not unreserved.",
      });
    }
    const patient = await validatePatient(patientUsername, res);
    const doctor = await validateDoctor(appointment.doctorUsername, res);
    appointment.status = "upcoming";
    if (isRequested == "true") {
      appointment.isFollowUp = true;
    }
    await appointment.save();

    await handlePatientAppointmentNotification(
      patient,
      appointment,
      isRequested,
      doctor
    );

    if (isRequested !== "true") {
      await handleDoctorAppointmentNotification(doctor, patient, appointment);
    }

    res.status(200).json({
      message: "Appointment booked successfully",
      data: {
        id: appointment._id,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        patientName: `${patient.firstName} ${patient.lastName}`,
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
