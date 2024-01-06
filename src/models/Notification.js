const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: false,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
