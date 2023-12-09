const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: String,
    },
    chat: {
        type: Schema.ObjectId,
        ref: 'Chat',
    },
    content: {
        type: String,
        trim: true,
    },
    readBy: [String],
} , {timestamps: true});

const Message = mongoose.model('Message', messageSchema, 'Message');
module.exports = Message;
