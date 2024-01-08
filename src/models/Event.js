const mongoose = require('mongoose');
const EventCategories = require('../data/eventCategories');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: EventCategories,
    },
    
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
