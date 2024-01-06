const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    role: {
        type: [String],
        required: true,
        enum: ['attendee', 'organizer'],
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
