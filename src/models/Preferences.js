const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    interests: [{
        type: String,
        required: true,
    }],
    foodPreferences: [{
        type: String,
        required: true,
    }],
    eventPreferences: [{
        type: String,
        required: true,
    }],
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
