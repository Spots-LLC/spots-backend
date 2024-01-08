const express = require('express');
const User = require('../models/User');
const Collection = require('../models/crud/Collection');


const router = express.Router();

const userCollection = new Collection(User);


// fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await userCollection.read();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch a specific user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await userCollection.read(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by ID. 
router.put('/user/:id', async (req, res) => {
    try {
        const updatedUser = await userCollection.update(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a User
router.delete('/user/:id', async (req, res) => {
    try {
        await userCollection.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;