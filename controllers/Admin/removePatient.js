
const Patient = require('../../models/Doctor'); 
const removePatient = async (req, res) => {
    const { Username } = req.body;
    const patient = await Patient.findOne({Username: Username });
    console.log(Username, patient);
    if(!patient) return res.status(400).json({message: 'Patient does not exist.'});
    await Patient.deleteOne({Username: Username });
    return res.status(200).json({message: 'Patient removed.'});
};

module.exports = removePatient;