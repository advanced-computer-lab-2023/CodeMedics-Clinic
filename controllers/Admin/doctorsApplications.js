
const Doctor = require('../../models/Doctor'); 
const viewDoctorApplications = async (req, res) => {
    try {
        const DoctorApplications = await Doctor.find({status: 'pending'});
        console.log('Doctor Applications:', DoctorApplications);

        if (!DoctorApplications || DoctorApplications.length == 0) {
            return res.status(404).json({message: 'No Doctor applications found.'});
        }
        console.log(DoctorApplications);
        return res.status(200).json({DoctorApplications});
    } catch (error) {
        return res.status(500).json({error: 'Failed to fetch Doctor applications.'});
    }
};