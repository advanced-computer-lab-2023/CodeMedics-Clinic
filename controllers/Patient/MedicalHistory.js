const Patient = require('../../models/Patient');
const upload = require('../../config/multerConfig');

exports.uploadDocument = upload.single('document'); // Assuming the field name in the form is 'document'

exports.addDocument = async (req, res) => {
    try {
        const { filename, originalname } = req.file;
        const { username, linkedId } = req.params; // Assuming linkedId is sent in the request parameters

        const patient = await Patient.findOne({ Username: username });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Handle the Linked field
        patient.Linked = linkedId || null; // Set to null if linkedId is empty

        patient.HealthRecords.push({ filename, originalname, uploadedBy: username });
        await patient.save();

        res.status(201).json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.removeDocument = async (req, res) => {
    try {
        const { documentId, username } = req.params;

        const patient = await Patient.findOne({ Username: username });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const documentIndex = patient.HealthRecords.findIndex(doc => doc._id.toString() === documentId);
        if (documentIndex === -1) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Remove the document from the array
        patient.HealthRecords.splice(documentIndex, 1);
        await patient.save();

        res.status(200).json({ message: 'Document removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
