const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const upload = require('../../config/multerConfig');


exports.uploadDocument = upload.single('document'); // Assuming the field name in the form is 'document'

exports.addHealthRecord = async (req, res) => {
    try {
        const { filename, originalname } = req.file;
        const { doctorUsername } = req.params;
        const { patientUsername } = req.body;
        console.log(req.body);
        // Check if the doctor exists
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        console.log(doctor);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if the patient exists
        const patient = await Patient.findOne({ Username: patientUsername });
        console.log(patient);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

      // Fetch all appointments with IDs present in the doctor's Appointments array
      const appointments = await Appointment.find({ _id: { $in: doctor.Appointments } });

      // Check if any appointment includes the patientUsername
      const hadAppointment =appointments.some(
        (appointment) => appointment.patient === patientUsername && appointment.status === 'completed'
    );

        if (!hadAppointment) {
            return res.status(403).json({ message: 'Doctor never had appointments with this patient yet' });
        }

        // Assuming healthRecords is an array in the Patient model
        patient.HealthRecords.push({ filename, originalname, uploadedBy:'Doctor'+''+doctorUsername });
        await patient.save();
console.log( patient.HealthRecords);
        res.status(201).json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};