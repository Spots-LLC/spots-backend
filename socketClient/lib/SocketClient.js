'use strict';
const io = require('socket.io-client');
const logger = require('../../src/utils/logger');

class SocketClient {
    constructor(clientId, serverUrl) {
        this.clientId = clientId;
        this.socket = io(serverUrl);

        this.socket.on('connect', () => {
            logger.info(`${this.clientId} established a connection with the server`);
            this.socket.emit('register', { clientId: this.clientId });
        });
        
        

        this.socket.on('user connected', (user) => {
            logger.info('User connected:', user);
        });

        this.socket.on('user disconnected', (userId) => {
            logger.info('User disconnected:', userId);
        });
    }

    subscribe(event, callback) {
        this.socket.on(event, callback);
        logger.debug(`Subscribed to event: ${event}`);
    }

   
    // Method to handle receiving the list of users
    onUsersList(callback) {
        this.subscribe('users', callback);
    }

    // Method to handle user connection notifications
    onUserConnected(callback) {
        this.subscribe('user connected', callback);
    }
}

module.exports = SocketClient;