const jwt = require('jsonwebtoken');
const Doctor = require('../../models/Doctor'); 
const { getUsername } = require('../../config/infoGetter');

exports.getDoctorMessages = async (req, res) => {
  try {
    const doctorUsername = await getUsername(req, res);

    // Now you can use doctorId to retrieve messages
    const doctor = await Doctor.findOne({ Username: doctorUsername });

    if (!doctor) {
      console.log('Doctor not found.');
      return res.status(404).json({ error: 'Doctor not found' });
    }

    console.log('Doctor found:', doctor);

    res.status(200).json({ messages: doctor.Messages });
  } catch (error) {
    console.error('Error retrieving doctor messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};