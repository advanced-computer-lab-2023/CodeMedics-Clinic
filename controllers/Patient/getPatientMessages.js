const Patient = require('../../models/Patient'); // Import the Patient model

exports.getPatientMessages = async (req, res) => {
  try {
    const {patientUsername} = req.params;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      console.log('Patient not found.');
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ data: patient.messages });
  } catch (error) {
    console.error('Error retrieving patient messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};