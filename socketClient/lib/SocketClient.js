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
        
        

        this.socket.on('user connected', (message) => {
            logger.info(message);
        });

        this.socket.on('user disconnected', (message) => {
            logger.info(message);
        });
        
    }
}

module.exports = SocketClient;