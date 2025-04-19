const Message = require("../../models/Message");
const Chat = require("../../models/Chat");

exports.getChatMessages = async (chatId) => {
  const messages = await Message.find({ chat: chatId }).sort({
    createdAt: 1,
  });
  return messages;
};

exports.sendMessage = async (chatId, sender, content) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    const error = new Error("Chat not found");
    error.statusCode = 404;
    throw error;
  }
  const newMessage = new Message({
    chat: chatId,
    sender,
    content,
  });
  await newMessage.save();
  chat.latestMessage = newMessage._id;
  await chat.save();
  return newMessage;
};

exports.getLatestMessage = async (chatId) => {
  const latestMessage = await Message.findOne({ chat: chatId }).sort({
    createdAt: -1,
  });
  return latestMessage;
};

exports.getPharmacyChat = async (username) => {
  const pharmacyChat = await Chat.findOne({
    users: [username, "admin"],
  });
  if (!pharmacyChat) {
    const newChat = new Chat({
      users: [username, "admin"],
    });
    await newChat.save();
    return { pharmacy: true, chat: newChat, latestMessage: null };
  }
  const latestMessage = await this.getLatestMessage(pharmacyChat._id);
  return { pharmacy: true, chat: pharmacyChat, latestMessage };
};

exports.getChat = async (patientUsername, doctorUsername) => {
  const chat = await Chat.findOne({
    users: [patientUsername, doctorUsername],
  });
  return chat;
};

exports.createChat = async (patientUsername, doctorUsername) => {
  const chat = new Chat({
    users: [patientUsername, doctorUsername],
  });
  await chat.save();
  return chat;
};
