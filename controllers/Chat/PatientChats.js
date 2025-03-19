const express = require("express");
const Chat = require("../../models/Chat");
const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");
const Message = require("../../models/Message");
const { getUsername } = require("../../config/infoGetter");

exports.getPatientChats = async (req, res) => {
  try {
    const { patientUsername } = req.params;

    console.log("here ----> ", patientUsername);
    const user = await Patient.findOne({ username: patientUsername });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const appointments = await Appointment.find({ patientUsername });
    const doctors = [];
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      if (
        appointment.status != "completed" &&
        appointment.status != "follow-up Requested"
      ) {
        continue;
      }
      console.log("passed", appointment, appointment.doctorUsername)
      const doctor = await Doctor.findOne({
        username: appointment.doctorUsername,
      });
      if (!doctor) {
        return res.status(400).json({ message: "Doctor not found" });
      }
      if (!doctors.some((doc) => doc.username == doctor.username)) {
        doctors.push(doctor);
      }
    }
    console.log("patient chats", doctors);
    const chats = [];
    const pharmacyChat = await Chat.findOne({
      users: [patientUsername, "admin"],
    });
    if (!pharmacyChat) {
      const newChat = new Chat({
        users: [patientUsername, "admin"],
      });
      await newChat.save();
      chats.push({ pharmacy: true, chat: newChat, latestMessage: null });
    } else {
      const latestMessage = await Message.findOne({
        chat: pharmacyChat._id,
      }).sort({ createdAt: -1 });
      chats.push({ pharmacy: true, chat: pharmacyChat, latestMessage });
    }
    for (let i = 0; i < doctors.length; i++) {
      const chat = await Chat.findOne({
        users: [user.username, doctors[i].username],
      });
      if (!chat) {
        const newChat = new Chat({
          users: [user.username, doctors[i].username],
        });
        await newChat.save();
        chats.push({
          doctor: doctors[i],
          chat: newChat,
          latestMessage: null,
          user,
        });
      } else {
        const latestMessage = await Message.findOne({ chat: chat._id }).sort({
          createdAt: -1,
        });
        chats.push({ doctor: doctors[i], chat, latestMessage, user });
      }
    }
    chats.sort((a, b) => {
      if (a.chat.updatedAt > b.chat.updatedAt) return -1;
      if (a.chat.updatedAt < b.chat.updatedAt) return 1;
      return 0;
    });
    res.status(200).json({ data: chats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
