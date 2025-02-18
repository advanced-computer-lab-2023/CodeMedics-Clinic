const Doctor = require("../../models/Doctor");
const { validateDoctor } = require("../../utils/validator");
exports.getDoctor = async (req, res) => {
  const { doctorUsername } = req.params;
  try {
    const doctor = await validateDoctor(doctorUsername, res);
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
