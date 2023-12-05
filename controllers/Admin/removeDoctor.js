
const Doctor = require('../../models/Doctor'); 
const removeDoctor = async (req, res) => {
    const { Username } = req.body;
    const doctor = await Doctor.findOne({Username: Username });
    await Doctor.deleteOne({Username: Username });
    return res.status(200).json({message: 'Doctor removed.'});
};

module.exports = removeDoctor;