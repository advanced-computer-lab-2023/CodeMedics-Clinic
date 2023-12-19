const Doctor = require('../../models/Doctor');

exports.addTimeSlot = async (req, res) => {
    try {
        const { username } = req.params;
        const { day, startTime, endTime } = req.body;

        const doctor = await Doctor.findOne({ Username: username });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Add the new time slot to the AvailableTimeSlots array
        doctor.AvailableTimeSlots.push({ day, startTime, endTime });

        // Save the changes
        await doctor.save();

        res.status(200).json({ message: 'Time slot added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
