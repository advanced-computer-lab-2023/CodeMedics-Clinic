
const Doctor = require('../../models/Doctor'); 
const viewDoctors = async (req, res) => {
    const doctors = await Doctor.find({Status: "Approved"});
    return res.status(200).json({doctors});
};

module.exports = viewDoctors;