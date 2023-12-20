const express = require('express');
const Chat = require('../../models/Chat');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Message = require('../../models/Message');
const {getUsername} = require('../../config/infoGetter');

exports.getPatientChats = async (req, res) => {
    try {
        const Username = await getUsername(req , res);
        
        console.log('here ----> ', Username);
        const user = await Patient.findOne({ Username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const doctors = [];
        for(let i=0; i<user.Appointments.length; i++){
            const appointment = await Appointment.findOne({ _id: user.Appointments[i]});
            if(appointment.status != 'completed' || appointment.status != 'follow-up Requested'){
                continue;
            }
            const doctor = await Doctor.findOne({Username: appointment.doctorUsername});
            if(!doctor){
                return res.status(400).json({ message: 'Doctor not found' });
            }
            if(!doctors.some(doc => doc.Username == doctor.Username)){
                doctors.push(doctor);
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
        for(let i=0; i<doctors.length; i++){
            const chat = await Chat.findOne({users: [user.Username, doctors[i].Username]});
            if(!chat){
                const newChat = new Chat({
                    users: [user.Username, doctors[i].Username],
                });
                await newChat.save();
                chats.push({doctor: doctors[i] , chat: newChat , latestMessage: null , user});
            }
            else{
                const latestMessage = await Message.findOne({chat: chat._id}).sort({createdAt: -1});
                chats.push({doctor: doctors[i] , chat , latestMessage , user});
            }
        }
        chats.sort((a, b) => {
            if(a.chat.updatedAt > b.chat.updatedAt) return -1;
            if(a.chat.updatedAt < b.chat.updatedAt) return 1;
            return 0;
        });
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};