const express = require('express');
const http = require('http');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const setupSocketIO = require('./utils/socket'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const preferencesRoutes = require('./routes/preferences');
const restaurantRoutes = require('./routes/restaurant');
const notFound = require('./handlers/404');
const errorHandler = require('./handlers/500');
require('dotenv').config();

const PORT = process.env.PORT || 5002;
const app = express();


app.use(express.json());

// Proof of Life Route
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

// Route that triggers an error for testing
app.get('/error', (req, res, next) => {
    throw new Error('Forced Error for Testing');
});

// API routes
app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(preferencesRoutes);
app.use(restaurantRoutes);

// Handlers for 404 and 500 errors
app.use('*', notFound);
app.use(errorHandler);

// Creates the HTTP server and setup Socket.io
const server = http.createServer(app);
setupSocketIO(server);


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            // MongoDB connection options
        });
        logger.info('Connected to MongoDB');

        server.listen(PORT, () => {
            logger.info(`Server is running on PORT: ${PORT}`);
        });
    } catch (e) {
        logger.error(`Error connecting to MongoDB: ${e.message}`);
    }
};

module.exports = { app, start, server };
