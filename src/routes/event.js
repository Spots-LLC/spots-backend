const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const Event = require('../models/Event');
const Collection = require('../models/crud/Collection');

const router = express.Router();
const eventCollection = new Collection(Event);

// Create an event
router.post('/event', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const eventDetails = {
            ...req.body,
            organizer: userId,
        };

        const newEvent = await eventCollection.create(eventDetails);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all events
router.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await eventCollection.read();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific event by ID
router.get('/event/:id', verifyToken, async (req, res) => {
    try {
        const event = await eventCollection.read(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an event
router.put('/event/:id', verifyToken, async (req, res) => {
    try {
        const updatedEvent = await eventCollection.update(req.params.id, req.body);
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an event
router.delete('/event/:id', verifyToken, async (req, res) => {
    try {
        await eventCollection.delete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
