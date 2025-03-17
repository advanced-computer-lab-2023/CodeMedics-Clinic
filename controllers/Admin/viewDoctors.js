const Doctor = require("../../models/Doctor");
const viewDoctors = async (req, res) => {
  const doctors = await Doctor.find({ status: "approved" });
  return res.status(200).json({ data: doctors });
};

module.exports = viewDoctors;
