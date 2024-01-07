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
        enum: [
            'sports',
            'music',
            'tech',
            'art',
            'travel',
            'literature'],
    }],
    foodPreferences: [{
        type: String,
        required: true,
        enum: [
            'vegan',
            'vegetarian',
            'gluten-free',
            'halal',
            'kosher',
            'no restrictions'],
    }],
    eventPreferences: [{
        type: String,
        required: true,
        enum: [
            'music',
            'tech',
            'yoga',
            'concert',
            'art',
            'workout',
            'cooking class',
            'dance class',
            'language class',
            'photography workshop',
            'fitness class',
            'educational seminar',
            'business workshop',
            'outdoor activity',
            'community gathering',
        ],
    }],
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
