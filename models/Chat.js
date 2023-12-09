const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    users: {
        type: [String],
    },
    latestMessage: {
        type: Schema.ObjectId,
        trim: true,
        ref: 'Message',
    },
} , {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema, 'Chat');
module.exports = Chat;
