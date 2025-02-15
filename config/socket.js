
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

exports.putSocket = async (username, socketId) => {
    try {
        const id = socketId;
        const user1 = await Patient.findOne({ username: username });
        const user2 = await Doctor.findOne({ username: username });
        if (!user1 && !user2) {
            console.log("User not found"); 
            // return res.status(404).json({ message: "User not found" });
            return;
        }
        const user = user1 ? user1 : user2;
        user.socketId = id;
        await user.save();

    } catch (error) {
        console.log(error);
    }
 };

exports.getSocket = async (username) => {
    try{
        const user1 = await Patient.findOne({ username: username });
        const user2 = await Doctor.findOne({ username: username });
        if (!user1 && !user2) {
            console.log("User not found", username); 
            // return res.status(404).json({ message: "User not found" });
            return;
        }
        const user = user1 ? user1 : user2;
        return user.socketId;
    }catch(error){
        console.log(error);
    }
};

exports.joinSocket = async (socket) => {
    try{
        const patients = await Patient.find();
        const doctors = await Doctor.find();
        for(let patient of patients)
            socket.join(patient.Username + " room");
        for(let doctor of doctors)
            socket.join(doctor.Username + " room");

    }catch(error){
        console.log(error);
    }
};