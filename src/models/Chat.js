const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
    }],
    type: {
        type: String,
        required: true,
        enum: ['private', 'group'],
        trim: true,
    },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
