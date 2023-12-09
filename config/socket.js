
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

exports.putSocket = async (username, isDoctor, socketID) => {
    try {
        const id = socketID;
        const user = isDoctor ? await Doctor.findOne({ Username: username }) : await Patient.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.SocketID = id;
        await user.save();
    } catch (error) {
        console.log(error);
    }
 };