
const Patient = require('../../models/Doctor'); 
const viewPatients = async (req, res) => {
    const patients = await Patient.find();
    return res.status(200).json({patients});
};

module.exports = viewPatients;