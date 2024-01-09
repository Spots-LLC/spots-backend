const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const User = require('./models/User');
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

// Route to get connected Users
app.get('/socketUsers', (req, res) => {
    res.json(connectedUsers);
});

app.use('*', notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = socketio(server);

io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return next(new Error('Username does not exist'));
        }

        socket.username = username;
        next();
    } catch (error) {
        next(new Error('Server error during authentication'));
    }
});

let connectedUsers = [];


io.on('connection', async (socket) => {
    const username = socket.username;
    connectedUsers.push({ userID: socket.id, username: username });
    try {
        // Fetch existing users from database
        const users = await User.find({}).select('username _id');
        socket.emit('users', users.map(user => ({ userID: user._id, username: user.username })));
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
    }

    // Notify existing users
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
    });

    // Notify users upon disconnection
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.userID !== socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
    });

});



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

module.exports = { app, start };
