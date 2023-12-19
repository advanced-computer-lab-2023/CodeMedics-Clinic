const jwt = require('jsonwebtoken');
const Patient = require('../../models/Patient'); // Import the Patient model
const { getUsername } = require('../../config/infoGetter');

exports.getPatientMessages = async (req, res) => {
  try {
    const patientUsername = await getUsername(req, res);

    // Now you can use patientId to retrieve messages
    const patient = await Patient.findOne({ Username: patientUsername });

    if (!patient) {
      console.log('Patient not found.');
      return res.status(404).json({ message: 'Patient not found' });
    }

    console.log('Patient found:', patient);

    res.status(200).json({ messages: patient.Messages });
  } catch (error) {
    console.error('Error retrieving patient messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};