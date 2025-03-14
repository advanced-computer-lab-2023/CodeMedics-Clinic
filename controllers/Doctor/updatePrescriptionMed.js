const Prescription = require("../../models/Prescription");
const Medicine = require("../../models/Medicine");
const { getUsername } = require("../../config/infoGetter");
const Doctor = require("../../models/Doctor");
const Patient = require("../../models/Patient");
const Appointment = require("../../models/Appointment");

exports.addMedicineToPrescription = async (req, res) => {
  try {
    const { prescriptionId, doctorUsername } = req.params;
    const { medicineName, dosage } = req.body;
    console.log(
      "in the add medicine to prescription",
      prescriptionId,
      medicineName,
      dosage
    );
    if (parseInt(dosage) <= 0) {
      return res
        .status(404)
        .json({ message: "Dosage Must be a positive number" });
    }

    const prescription = await Prescription.findOne({ _id: prescriptionId });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    const medicine = await Medicine.findOne({ name: medicineName });

    if (!medicine || medicine.availableQuantity == 0) {
      return res
        .status(404)
        .json({ message: "Medicine not available in the Pharmacy." });
    }

    const medicineData = { drugName: medicineName, dosage };
    let found = false;
    for (const drug of prescription.drug) {
      if (drug.drugName == medicineName) {
        drug.dosage = dosage;
        found = true;
        break;
      }
    }
    if (!found) prescription.drug.push(medicineData);
    await prescription.save();

    res.status(201).json({
      message: "Medicine added to prescription successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.removeMedicineFromPrescription = async (req, res) => {
  try {
    const doctorUsername = await getUsername(req, res);
    const { prescriptionID, medicineName } = req.body;
    console.log(
      "in the remove medicine from prescription",
      prescriptionID,
      medicineName
    );
    if (!doctorUsername) {
      return res
        .status(401)
        .json({ message: "Authentication error: Doctor not logged in." });
    }

    const doctor = await Doctor.findOne({ Username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const prescription = await Prescription.findOne({ _id: prescriptionID });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found or doctor does not have access.",
      });
    }

    const medicineIndex = prescription.drug.findIndex(
      (med) => med.drugName === medicineName
    );
    if (medicineIndex === -1) {
      return res
        .status(404)
        .json({ message: "Medicine not found in the prescription." });
    }

    prescription.drug.splice(medicineIndex, 1);
    if (prescription.drug.length === 0) {
      await Prescription.deleteOne({ _id: prescriptionID });
      return res
        .status(200)
        .json({ message: "Prescription deleted successfully" });
    }
    await prescription.save();

    res.status(201).json({
      message: "Medicine removed from prescription successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
