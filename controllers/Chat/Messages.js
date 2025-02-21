const Chat = require("../../models/Chat");
const Message = require("../../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log("hola ------------------> ", chatId);
    const messages = await Message.find({ chat: chatId }).sort({
      createdAt: 1,
    });
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    const newMessage = new Message({
      chat: chatId,
      sender,
      content,
    });
    await newMessage.save();
    chat.latestMessage = newMessage._id;
    await chat.save();
    res.status(200).json({ data: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
