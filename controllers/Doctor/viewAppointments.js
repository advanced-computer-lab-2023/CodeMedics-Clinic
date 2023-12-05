const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const {getUsername} = require('../../config/infoGetter');
exports.viewUpcomingAppointments = async (req, res) => {
    try {
        const { doctorUsername } = req.params;
        const doctor = await Doctor.findOne({ Username: doctorUsername });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const currentDate = new Date().toISOString(); // Use UTC format

        // Filter appointments with status "upcoming" or "rescheduled"
        const upcomingAppointments = await Appointment.find({
            _id: { $in: doctor.Appointments },
            status: { $in: ['upcoming', 'rescheduled'] }
        }).lean();

        res.status(200).json({ upcomingAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.viewPastAppointments = async (req, res) => {
    try {
        const { doctorUsername } = req.params;
        const doctor = await Doctor.findOne({ Username: doctorUsername });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Filter appointments with status "completed," "cancelled," or "rescheduled"
        const pastAppointments = await Appointment.find({
            _id: { $in: doctor.Appointments },
            status: { $in: ['completed', 'cancelled'] }
        }).lean();

        res.status(200).json({ pastAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllDocAppointments = async (req, res) => {
    try{
        const doctor = await getUsername(req, res);
        if(doctor === "") return res.status(401).json({message:"You are not logged in."})
        const appointments = (await Doctor.findOne({Username: doctor})).Appointments;
        const data = [];
        for(let i = 0; i<appointments.length; i++){
            const appID = appointments[i];
            const app = await Appointment.findOne({_id: appID});
            console.log(app);
            data.push(app);
        }
        // console.log("VIEW APPOINTMENTS", data);
        return res.status(200).json(data);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }
};

