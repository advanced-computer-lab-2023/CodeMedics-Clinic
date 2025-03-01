const Appointment = require("../../models/Appointment");

exports.addAppointment = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    let { startHour, endHour, date } = req.body;
    date = date.split("T")[0];
    console.log("INSIDE ADD APPOINTMENTS BACKEND");
    startHour = startHour.substring(0, 2);
    endHour = endHour.substring(0, 2);
    const exists = await Appointment.findOne({
      date,
      startHour,
      endHour,
      doctorUsername,
    });

    if (exists) {
      return res.status(400).json({ message: "Appointment already exists" });
    }

    const dateToBeAdded = new Date(date);
    dateToBeAdded.setHours(startHour);
    dateToBeAdded.setMinutes(0);
    dateToBeAdded.setSeconds(0);
    dateToBeAdded.setMilliseconds(0);

    if (dateToBeAdded < new Date()) {
      return res
        .status(400)
        .json({ message: "Appointment date is in the past" });
    }

    const appointment = new Appointment({
      doctorUsername,
      patientUsername: null,
      date: date,
      startHour: startHour,
      endHour: endHour,
      status: "unreserved",
    });
    await appointment.save();
    res.status(204).json({ message: "Appointment added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
