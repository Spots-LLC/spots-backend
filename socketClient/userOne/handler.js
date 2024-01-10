const SocketClient = require('../lib/SocketClient');
const logger = require('../../src/utils/logger');

const serverUrl = 'http://localhost:3001';
const username = 'alicegreen';

const client = new SocketClient(username, serverUrl);

client.socket.auth = { username };
client.socket.connect();

client.socket.on('connect', () => {
    logger.info(`Connected to server as ${username}`);
});