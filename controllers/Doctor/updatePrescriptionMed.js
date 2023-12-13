const Prescription = require('../../models/Prescription');
const Medicine = require('../../models/Medicine');
const { getUsername } = require('../../config/infoGetter');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');


exports.addMedicineToPrescription = async (req, res) => {
  try {
    const doctorUsername = await getUsername(req, res);
    const { prescriptionID, medicineName, dosage } = req.body;

    if (!doctorUsername) {
      return res.status(401).json({ message: 'Authentication error: Doctor not logged in.' });
    }

    // const appointmentIds = doctor.Appointments;
    // const hasCompletedAppointment = await Appointment.exists({
    //     _id: { $in: appointmentIds },
    //     patient: patientUsername,
    //     status: 'completed',
    // });

    // if (!hasCompletedAppointment) {
    //     return res.status(403).json({ error: 'Doctor never had completed appointments with this patient' });
    // }

    const prescription = await Prescription.findOne({ _id:prescriptionID });
  
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found or doctor does not have access.' });
    }

    const medicine = await Medicine.findOne({ name: medicineName });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found in the Pharmacy.' });
    }


    const medicineData = { drugName: medicineName };
    if (dosage) {
      medicineData.dosage = dosage;
    }
    
    prescription.Drug.push(medicineData);    
    await prescription.save();

    res.status(200).json({ message: 'Medicine added to prescription successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.removeMedicineFromPrescription = async (req, res) => {
  try {
    const doctorUsername = await getUsername(req, res);
    const { prescriptionID, medicineName } = req.body;

    if (!doctorUsername) {
      return res.status(401).json({ message: 'Authentication error: Doctor not logged in.' });
    }

    const doctor = await Doctor.findOne({ Username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }


    // const appointmentIds = doctor.Appointments;
    // const hasCompletedAppointment = await Appointment.exists({
    //     _id: { $in: appointmentIds },
    //     patient: patientUsername,
    //     status: 'completed',
    // });

    // if (!hasCompletedAppointment) {
    //     return res.status(403).json({ error: 'Doctor never had completed appointments with this patient' });
    // }

    const prescription = await Prescription.findOne({ _id:prescriptionID });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found or doctor does not have access.' });
    }

    const medicineIndex = prescription.Drug.findIndex(med => med.drugName === medicineName);
    if (medicineIndex === -1) {
      return res.status(404).json({ message: 'Medicine not found in the prescription.' });
    }

    prescription.Drug.splice(medicineIndex, 1);
    await prescription.save();

    res.status(200).json({ message: 'Medicine removed from prescription successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
