const Patient = require("../../models/Patient");
const viewPatients = async (req, res) => {
  const patients = await Patient.find();
  return res.status(200).json({ data: patients });
};

module.exports = viewPatients;
