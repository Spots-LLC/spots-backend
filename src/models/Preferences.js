const mongoose = require('mongoose');
const CuisineTypes = require('../data/cuisineTypes');
const EventCategories = require('../data/eventCategories');
const Interests = require('../data/interests');

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
        enum: Interests,
    }],
    cuisinePreferences: [{
        type: String,
        required: true,
        enum: CuisineTypes,
    }],
    eventPreferences: [{
        type: String,
        required: true,
        enum: EventCategories,
    }],
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
