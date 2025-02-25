const upload = require("../../config/multerConfig");
const { validatePatient } = require("../../utils/validator");

exports.uploadDocument = upload.single("document"); // Assuming the field name in the form is 'document'

exports.addDocument = async (req, res) => {
  try {
    const { patientUsername } = req.params;
    const { filename, originalname } = req.file;
    const { username, linkedId } = req.body;

    const patient = await validatePatient(patientUsername, res);

    patient.linked = linkedId || null; // Set to null if linkedId is empty

    patient.healthRecords.push({
      filename,
      originalname,
      uploadedBy: username,
    });
    await patient.save();

    res.status(204).json({ message: "Document uploaded successfully" });
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
