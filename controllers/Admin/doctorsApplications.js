
const Doctor = require('../../models/Doctor'); 
const viewDoctorApplications = async (req, res) => {
    try {
        // console.log("I am here, in the viewDoctorApplications");
        const DoctorApplications = await Doctor.find({Status: 'Pending'});
        const all = await Doctor.find();
        // console.log("Doctors", all);
        
        // console.log('Doctor Applications:', DoctorApplications);

        if (!DoctorApplications || DoctorApplications.length == 0) {
            return res.status(404).json({message: 'No Doctor applications found.'});
        }
        // console.log(DoctorApplications);
        return res.status(200).json({DoctorApplications});
    } catch (error) {
        return res.status(500).json({message: 'Failed to fetch Doctor applications.'});
    }
};

module.exports = viewDoctorApplications;