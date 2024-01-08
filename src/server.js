const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const preferencesRoutes = require('./routes/preferences');
const restaurantRoutes = require('./routes/restaurant');

// error handlers
const notFound = require('./handlers/404');
const errorHandler = require('./handlers/500');

require('dotenv').config();
const PORT = process.env.PORT || 5002;

const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});

app.get('/error', (req, res, next) => {
    throw new Error('Forced Error for Testing');
});



app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(preferencesRoutes);
app.use(restaurantRoutes);

app.use('*', notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    logger.info('A user connected to socket.io');

    socket.on('register-user', (data) => {
        logger.info(`New user registered: ${data.username}`);
    });

    socket.on('disconnect', () => {
        logger.info('User disconnected');
    });
});

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            // options will be addead as db features are added. 
        });
        logger.info('Connected to MongoDB');

        server.listen(PORT, () => {
            logger.info(`Server is running on PORT: ${PORT}`);
        });
    } catch (e) {
        logger.error(`Error connecting to MongoDB: ${e.message}`);
    }
};

module.exports = { app, start };
