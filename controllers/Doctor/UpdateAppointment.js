const Appointment = require("../../models/Appointment");
const { validateAppointment } = require("../../utils/validator");

exports.CompleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log("completing", appointmentId, req.params);
    const appointment = await validateAppointment(appointmentId, res);
    console.log(appointment);
    appointment.status = "completed";
    await appointment.save();
    res.status(201).json({ message: "Appointment Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Wrong Happened while Cancelling" });
  }
};

exports.UpdateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, patientUsername } = req.body;
    console.log("completing", appointmentId, req.body);
    const appointment = await validateAppointment(appointmentId, res);
    console.log(appointment);
    appointment.status = status;
    appointment.patientUsername = patientUsername;
    await appointment.save();
    res.status(201).json({ message: "Appointment Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something Wrong Happened while Cancelling" });
  }
};

exports.DeleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.deleteOne({ _id: appointmentId });
    res.status(201).json({ message: "Appointment Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error, please try again" });
  }
};
