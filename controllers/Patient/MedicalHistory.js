const Patient = require("../../models/Patient");
const upload = require("../../config/multerConfig");
const { validatePatient } = require("../../utils/validator");

exports.uploadDocument = upload.single("document"); // Assuming the field name in the form is 'document'

exports.addDocument = async (req, res) => {
  try {
    const { filename, originalname } = req.file;
    const { username, linkedId } = req.params; // Assuming linkedId is sent in the request parameters

    const patient = await Patient.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Handle the Linked field
    patient.Linked = linkedId || null; // Set to null if linkedId is empty

    patient.HealthRecords.push({
      filename,
      originalname,
      uploadedBy: username,
    });
    await patient.save();

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeDocument = async (req, res) => {
  try {
    const { documentId, patientUsername } = req.params;
    const patient = validatePatient(patientUsername, res);
    const documentIndex = patient.HealthRecords.findIndex(
      (doc) => doc._id.toString() === documentId
    );
    if (documentIndex === -1) {
      return res.status(404).json({ message: "Document not found" });
    }
    patient.healthRecords.splice(documentIndex, 1);
    await patient.save();
    res.status(204).json({ message: "Document removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
