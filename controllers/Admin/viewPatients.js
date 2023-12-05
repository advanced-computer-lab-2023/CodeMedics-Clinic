
const Patient = require('../../models/Patient'); 
const viewPatients = async (req, res) => {
    const patients = await Patient.find();
    console.log(patients);
    return res.status(200).json({patients});
};

module.exports = viewPatients;