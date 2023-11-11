const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');

exports.docViewHealthRecords = async (req, res) => {
    try {
        const { doctorUsername } = req.params;

        // Find the doctor based on the provided username
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Get the list of patient usernames the doctor has appointments with
        const patientUsernames = doctor.Appointments.map(appointment => appointment.patient);

        // Retrieve health records for those patients
        const healthRecords = await Patient.find({ Username: { $in: patientUsernames } })
            .select('Username HealthRecords');

        res.status(200).json({ healthRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
