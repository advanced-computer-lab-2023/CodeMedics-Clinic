const Patient = require('../../models/Patient');

exports.viewHealthRecords = async (req, res) => {
    try {
        const { username } = req.params;
        const patient = await Patient.findOne({ Username: username });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const healthRecords = patient.HealthRecords;
        //console.log(healthRecords); 
        res.status(200).json({ healthRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


