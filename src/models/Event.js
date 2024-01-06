const mongoose = require('mongoose');

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
    },
    
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
