const { validateDoctor } = require("../../utils/validator");

exports.getDoctorMessages = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const doctor = await validateDoctor(doctorUsername, res);
    res.status(200).json({ data: doctor.messages });
  } catch (error) {
    console.error("Error retrieving doctor messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
