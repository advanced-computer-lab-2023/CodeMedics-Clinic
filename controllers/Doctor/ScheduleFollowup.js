const Doctor = require('../../models/Doctor.js');
const Patient = require('../../models/Patient.js');
const Appointment = require('../../models/Appointment.js');

exports.scheduleFollowUp = async (req, res) => {
    const { doctorUsername } = req.params;
    const { patientUsername, date, startHour, endHour, status, purpose } = req.body;

    try {
        const doctor = await Doctor.findOne({ Username: doctorUsername });
        const patient = await Patient.findOne({ Username: patientUsername });

        // Check if the doctor and patient exist
        if (!doctor || !patient) {
            return res.status(404).json({ error: 'Doctor or patient not found' });
        }
        /*
        // const utcDate = new Date(date).toISOString();
        // Create a new Appointment object */

        const appointment = new Appointment({
            doctor: doctor.Username ,
            patient: patient.Username, 
            date: new Date(date),
            startHour: startHour,
            endHour: endHour,
            status: status,
            purpose: purpose
        });


        await appointment.save();

        doctor.Appointments.push(appointment._id);
        patient.Appointments.push(appointment._id);

        await doctor.save();
        await patient.save();

        res.status(201).json({ message: 'Follow-up appointment scheduled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
