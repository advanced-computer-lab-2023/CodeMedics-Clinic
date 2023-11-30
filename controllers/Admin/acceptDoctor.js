
const Doctor = require('../../models/Doctor'); 
const viewDoctorApplications = async (req, res) => {
    const { Username } = req.body;
    const doctor = await Doctor.findOne({Username: Username });
    doctor.Status = "Approved";
    await doctor.save();
    return res.status(200).json({message: 'Doctor application Approved.'});
};

module.exports = viewDoctorApplications;