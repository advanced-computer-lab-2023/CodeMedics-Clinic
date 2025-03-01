const { validateAppointment } = require("../../utils/validator");

exports.CompleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log("completing", appointmentId, req.params);
    const appointment = await validateAppointment(appointmentId, res);
    console.log(appointment);
    appointment.status = "completed";
    await appointment.save();
    res.status(204).json({ message: "Appointment Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Wrong Happened while Cancelling" });
  }
};
