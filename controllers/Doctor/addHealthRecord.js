const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const upload = require('../../config/multerConfig');


exports.uploadDocument = upload.single('document'); // Assuming the field name in the form is 'document'

exports.addHealthRecord = async (req, res) => {
    try {
        const { filename, originalname } = req.file;
        const { doctorUsername } = req.params;
        const { patientUsername } = req.body;

        // Check if the doctor exists
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Check if the patient exists
        const patient = await Patient.findOne({ Username: patientUsername });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Check if the doctor has appointments with the patient
        const hasAppointment = doctor.Appointments.includes(patientUsername);
        if (!hasAppointment) {
            return res.status(403).json({ error: 'Doctor does not have appointments with the patient' });
        }

        // Assuming healthRecords is an array in the Patient model
        patient.HealthRecords.push({ filename, originalname, uploadedBy:'Doctor'+''+doctorUsername });
        await patient.save();

        res.status(201).json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
