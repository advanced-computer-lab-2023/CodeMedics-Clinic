const express = require('express');
const Chat = require('../../models/Chat');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Message = require('../../models/Message');
const { getUsername } = require('../../config/infoGetter');

exports.getDoctorChats = async (req, res) => {
    try {
        const Username = await getUsername(req, res);
        const user = await Doctor.findOne({ Username });
        if (!user) {
            return res.status(400).json({ message: 'Doctor not found' });
        }
        const patients = [];
        for (let i = 0; i < user.Appointments.length; i++) {
            const appointment = await Appointment.findById(user.Appointments[i]);
            if (appointment && appointment.status == 'completed') {
                const patient = await Patient.findOne({Username: appointment.patient});
                if (patient) {
                    if(!patients.some (p => p.Username === patient.Username)){
                        patients.push(patient);
                    }
                }
            }
        }
        const chats = [];
        const pharmacyChat = await Chat.findOne({users: [Username , 'admin']});
        if(!pharmacyChat){
            const newChat = new Chat({
                users: [Username , 'admin'],
            });
            await newChat.save();
            chats.push({pharmacy: true , chat: newChat , latestMessage: null});
        }
        else{
            const latestMessage = await Message.findOne({chat: pharmacyChat._id}).sort({createdAt: -1});
            chats.push({pharmacy: true , chat: pharmacyChat , latestMessage});
        }
        for(let i=0; i<patients.length; i++){
            const chat = await Chat.findOne({users: [patients[i].Username , user.Username]});
            if(!chat){
                const newChat = new Chat({
                    users: [patients[i].Username , user.Username],
                });
                await newChat.save();
                chats.push({patient: patients[i] , chat: newChat , latestMessage: null});
            }
            else{
                const latestMessage = await Message.findOne({chat: chat._id}).sort({createdAt: -1});
                chats.push({patient: patients[i] , chat , latestMessage});
            }
        }
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};