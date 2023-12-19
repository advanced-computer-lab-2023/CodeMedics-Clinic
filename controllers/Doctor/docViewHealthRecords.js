const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

exports.docViewHealthRecords = async (req, res) => {
    try {
        const { doctorUsername } = req.params;
        const { patientUsername } = req.body;

        // Find the doctor based on the provided username
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        if (!patientUsername) {
            return res.status(400).json({ message: 'Patient username is required' });
        }

        // Get the list of appointment IDs for the doctor
        const appointmentIds = doctor.Appointments;

        // Check if the desired patient had at least one completed appointment with this doctor
        const hasCompletedAppointment = await Appointment.exists({
            _id: { $in: appointmentIds },
            patient: patientUsername,
            status: 'completed',
        });

        if (!hasCompletedAppointment) {
            return res.status(403).json({ message: 'Doctor never had completed appointments with this patient' });
        }

        // Retrieve health records for the specified patient
        const healthRecords = await Patient.findOne({ Username: patientUsername })
            .select('Username HealthRecords');

        if (!healthRecords) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({ healthRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};