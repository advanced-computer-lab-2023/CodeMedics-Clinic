const Prescription = require("../../models/Prescription");
exports.getPrescriptions = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const prescriptions = await Prescription.find({
      doctorUsername,
    });
    res.status(200).json({ data: prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
