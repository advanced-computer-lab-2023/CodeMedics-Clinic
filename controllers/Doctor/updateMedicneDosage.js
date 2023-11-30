const Prescription = require('../../models/Prescription');
const Medicine = require('../../models/Medicine');
const { getUsername } = require('../../config/infoGetter');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');

// Update medicine dosage in a patient's prescription
exports.updateMedicineDosage = async (req, res) => {
    try {
      const doctorUsername = await getUsername(req, res);
      const { patientUsername, medicineName, newDosage } = req.body;
  
      if (!doctorUsername) {
        return res.status(401).json({ message: 'Authentication error: Doctor not logged in.' });
      }
  
      const doctor = await Doctor.findOne({ Username: doctorUsername });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
  
      const patient = await Patient.findOne({ Username: patientUsername });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
  
      const appointmentIds = doctor.Appointments;
      const hasCompletedAppointment = await Appointment.exists({
        _id: { $in: appointmentIds },
        patient: patientUsername,
        status: 'completed',
      });
  
      if (!hasCompletedAppointment) {
        return res.status(403).json({ error: 'Doctor never had completed appointments with this patient' });
      }
  
      const prescription = await Prescription.findOne({ Doctor: doctor.Username, Patient: patient.Username });
  
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found or doctor does not have access.' });
      }
  
      const medicineIndex = prescription.Drug.findIndex(med => med.drugName === medicineName);
  
      if (medicineIndex === -1) {
        return res.status(404).json({ message: 'Medicine not found in the Prescription.' });
      }
  
      if (newDosage) {
        prescription.Drug[medicineIndex].dosage = newDosage;
        await prescription.save();
  
        return res.status(200).json({ message: 'Medicine dosage updated successfully', prescription });
      } else {
        return res.status(400).json({ message: 'New dosage is required to update' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

exports.addMedicineDosage = async (req, res) => {
    try {
      const doctorUsername = await getUsername(req, res);
      const { patientUsername, medicineName, dosage } = req.body;
  
      if (!doctorUsername) {
        return res.status(401).json({ message: 'Authentication error: Doctor not logged in.' });
      }
  
      const doctor = await Doctor.findOne({ Username: doctorUsername });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
  
      const patient = await Patient.findOne({ Username: patientUsername });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
  
      const appointmentIds = doctor.Appointments;
      const hasCompletedAppointment = await Appointment.exists({
        _id: { $in: appointmentIds },
        patient: patientUsername,
        status: 'completed',
      });
  
      if (!hasCompletedAppointment) {
        return res.status(403).json({ error: 'Doctor never had completed appointments with this patient' });
      }
  
      const prescription = await Prescription.findOne({ Doctor: doctor.Username, Patient: patient.Username });
  
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found or doctor does not have access.' });
      }
  
   
      const medicine  = prescription.Drug.find(med => med.drugName === medicineName);
  
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found in the Prescription.' });
      }

      // If medicine already exists, update the dosage
      if (medicine) {
        if (dosage) {
            medicine.dosage = dosage;
          await prescription.save();
          return res.status(200).json({ message: 'Medicine dosage added successfully', prescription });
        } else {
          return res.status(400).json({ message: 'Dosage is required to update' });
        }
      }
  
  
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }; 