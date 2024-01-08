const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const Preferences = require('../models/Preferences');
const Collection = require('../models/crud/Collection');

const router = express.Router();
const preferencesCollection = new Collection(Preferences);

// Create or Update Preferences
router.post('/preferences', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const existingPreferences = await Preferences.findOne({ user: userId });

        if (existingPreferences) {
            
            const updatedPreferences = await Preferences.findByIdAndUpdate(existingPreferences._id, req.body, { new: true });
            res.status(200).json(updatedPreferences);
        } else {
            const newPreferences = await preferencesCollection.create({ ...req.body, user: userId });
            res.status(201).json(newPreferences);
        }
    } catch (error) {
        console.error('Error updating/creating preferences:', error);  // Added error logging
        res.status(500).json({ message: error.message });
    }
});


// Get User Preferences
router.get('/preferences', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const userPreferences = await Preferences.findOne({ user: userId });
        if (userPreferences) {
            res.status(200).json(userPreferences);
        } else {
            res.status(404).send('Preferences not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete User Preferences
router.delete('/preferences', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const userPreferences = await Preferences.findOneAndDelete({ user: userId });
        if (userPreferences) {
            res.status(200).send('Preferences deleted successfully');
        } else {
            res.status(404).send('Preferences not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
