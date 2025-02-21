const express = require("express");
const Chat = require("../../models/Chat");
const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");
const Message = require("../../models/Message");
const { getUsername } = require("../../config/infoGetter");

exports.getDoctorChats = async (req, res) => {
  try {
    const { doctorUsername } = req.params;
    const user = await Doctor.findOne({ username: doctorUsername });
    if (!user) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    const patients = [];
    const appointments = await Appointment.find({
      doctorUsername: doctorUsername,
    });
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      if (
        appointment.status == "completed" ||
        appointment.status == "follow-up Requested"
      ) {
        const patient = await Patient.findOne({
          username: appointment.patientUsername,
        });
        if (patient) {
          if (!patients.some((p) => p.username === patient.username)) {
            patients.push(patient);
          }
        }
      }
    }
    const chats = [];
    console.log("doctor chats", patients);
    const pharmacyChat = await Chat.findOne({
      users: [doctorUsername, "admin"],
    });
    if (!pharmacyChat) {
      const newChat = new Chat({
        users: [doctorUsername, "admin"],
      });
      await newChat.save();
      chats.push({ pharmacy: true, chat: newChat, latestMessage: null });
    } else {
      const latestMessage = await Message.findOne({
        chat: pharmacyChat._id,
      }).sort({ createdAt: -1 });
      chats.push({ pharmacy: true, chat: pharmacyChat, latestMessage });
    }
    for (let i = 0; i < patients.length; i++) {
      const chat = await Chat.findOne({
        users: [patients[i].username, user.username],
      });
      if (!chat) {
        const newChat = new Chat({
          users: [patients[i].username, user.username],
        });
        await newChat.save();
        chats.push({
          patient: patients[i],
          chat: newChat,
          latestMessage: null,
        });
      } else {
        const latestMessage = await Message.findOne({ chat: chat._id }).sort({
          createdAt: -1,
        });
        chats.push({ patient: patients[i], chat, latestMessage });
      }
    }
    chats.sort((a, b) => {
      if (a.chat.updatedAt > b.chat.updatedAt) return -1;
      if (a.chat.updatedAt < b.chat.updatedAt) return 1;
      return 0;
    });
    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
