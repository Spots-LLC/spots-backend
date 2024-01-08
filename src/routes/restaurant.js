const express = require('express');
const Restaurant = require('../models/Restaurant');
const Collection = require('../models/crud/Collection');

const router = express.Router();
const restaurantCollection = new Collection(Restaurant);

// Create a new Restaurant
router.post('/restaurant', async (req, res) => {
    try {
        const newRestaurant = await restaurantCollection.create(req.body);
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all Restaurants
router.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await restaurantCollection.read();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch a specific Restaurant by ID
router.get('/restaurant/:id', async (req, res) => {
    try {
        const restaurant = await restaurantCollection.read(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a specific Restaurant by ID
router.put('/restaurant/:id', async (req, res) => {
    try {
        const updatedRestaurant = await restaurantCollection.update(req.params.id, req.body);
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a Restaurant
router.delete('/restaurant/:id', async (req, res) => {
    try {
        await restaurantCollection.delete(req.params.id);
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
