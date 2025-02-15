const Doctor = require("../../models/Doctor");
exports.getDoctor = async (req, res) => {
  const { doctorUsername } = req.params;
  if (doctorUsername.length == 0) {
    res.status(400).json({ message: "A username must be provided." });
    return;
  }
  try {
    const doctor = await Doctor.findOne({ username: doctorUsername });
    res.status(200).json({ data: doctor });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while searching for doctors." });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ data: doctors });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while searching for doctors." });
  }
};
