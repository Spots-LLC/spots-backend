'use strict';
require('dotenv').config({ path: '../../.env'});
const SocketClient = require('../lib/SocketClient');
const logger = require('../../src/utils/logger');


const userId = 'user';
const PORT = process.env.PORT || 5002;
const serverUrl = `http://localhost:${PORT}/online`;

const socketClient = new SocketClient(userId, serverUrl);

socketClient.socket.on('connect', () => {
    // joins a default chat room
    const defaultRoomId = 'general';
    socketClient.joinRoom(defaultRoomId);

    // proof of life
    logger.info(`User ${userId} joined room: ${defaultRoomId}`);
});

module.exports = socketClient;