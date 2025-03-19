const Medicine = require("../../models/Medicine");
const Prescription = require("../../models/Prescription");
const { validatePatient } = require("../../utils/validator");

exports.addPrescription = async (req, res) => {
  try {
    const { doctorUsername } = req.params;

    const { drugs, patientUsername, date } = req.body;
    const patient = await validatePatient(patientUsername, res);
    if (!drugs || !date) {
      return res
        .status(400)
        .json({ message: "Incomplete data for prescription" });
    }
    if (drugs.length == 0) {
      return res
        .status(400)
        .json({ message: "Add at least one medicine for the prescription" });
    }
    console.log("adding prescriptions", drugs, patient != null, date);
    for (const drug of drugs) {
      if (Number(drug.dosage) <= 0) {
        return res.status(400).json({ message: "Dosage should be positive" });
      }
      const medicine = await Medicine.findOne({ name: drug.drugName });
      if (!medicine) {
        return res.status(400).json({ message: `${drug.drugName} not Found` });
      }
      if (medicine.availableQuantity < Number(drug.dosgae)) {
        return res.status(400).json({
          message: `Out-of-stock medicine ${drug.drugName}`,
        });
      }
    }
    console.log("checked");

    const newPrescription = new Prescription({
      drug: drugs,
      doctorUsername,
      patientUsername,
      date,
      filled: false,
    });

    await newPrescription.save();

    res.status(201).json({
      message: "Prescription added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
