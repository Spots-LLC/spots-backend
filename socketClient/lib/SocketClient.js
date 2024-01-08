'use strict';
const io = require('socket.io-client');
const logger = require('../../src/utils/logger'); 

class SocketClient {
    constructor(clientId, serverUrl) {
        this.clientId = clientId;
        this.socket = io(serverUrl);

        // Event listener for when the socket connects to the server
        this.socket.on('connect', () => {
            logger.info(`${this.clientId} connected to server`); 
        });
    }

    // Method to publish events to the server
    publish(event, payload) {
        this.socket.emit(event, payload);
        logger.debug(`Published event: ${event} with payload: ${JSON.stringify(payload)}`);
    }

    // Method to subscribe to events from the server
    subscribe(event, callback) {
        this.socket.on(event, callback);
        logger.debug(`Subscribed to event: ${event}`); 
    }

    // Join a chat room
    joinRoom(roomId) {
        this.socket.emit('joinRoom', { clientId: this.clientId, roomId: roomId });
        logger.info(`${this.clientId} joined room ${roomId}`); 
    }

    // Leave a chat room
    leaveRoom(roomId) {
        this.socket.emit('leaveRoom', { clientId: this.clientId, roomId: roomId });
        logger.info(`${this.clientId} left room ${roomId}`); 
    }

    // Send a message to a chat room
    sendMessage(roomId, message) {
        this.socket.emit('message', { clientId: this.clientId, roomId: roomId, message: message });
        logger.info(`Message from ${this.clientId} in room ${roomId}: ${message}`); 
    }
}

module.exports = SocketClient;
