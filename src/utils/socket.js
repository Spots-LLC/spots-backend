'use strict';
const socketio = require('socket.io');
const User = require('../models/User');

module.exports = (server) => {
    const io = socketio(server);

    let connectedUsers = [];

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

    io.on('connection', (socket) => {
        const username = socket.username;
        connectedUsers.push({ userID: socket.id, username: username });

        socket.emit('users', connectedUsers);
        socket.broadcast.emit('user connected', `${username} is online`);

        const room = 'chatroom';
        socket.join(room);
        socket.to(room).emit('message', `${username} is in the chatroom!`);

        socket.on('joinRoom', ({ username, room }) => {
            socket.join(room);
            socket.to(room).emit('message', `${username} joined ${room}`);
        });

        socket.on('message', ({ room, message }) => {
            socket.to(room).emit('message', message);
        });

        socket.on('disconnect', () => {
            connectedUsers = connectedUsers.filter(user => user.userID !== socket.id);
            io.in(room).emit('message', `${username} has disconnected.`);
            socket.broadcast.emit('user disconnected', `${username} has disconnected`);
        });
    });

    return io;
};
