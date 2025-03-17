const Doctor = require("../../models/Doctor");
const removeDoctor = async (req, res) => {
  const { doctorUsername } = req.params;
  await Doctor.deleteOne({ username: doctorUsername });
  return res.status(200).json({ message: "Doctor removed." });
};

module.exports = removeDoctor;
