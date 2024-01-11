const SocketClient = require('../lib/SocketClient');
const logger = require('../../src/utils/logger');

const serverUrl = 'http://localhost:3001';
const username = 'bobmartin';

const client = new SocketClient(username, serverUrl);

client.socket.auth = { username };
client.socket.connect();

client.socket.on('users', (users) => {
    logger.info(`Users Online: ${users.map(u => u.username).join(', ')}`);
});

client.socket.on('connect', () => {
    logger.info(`Connected to server as ${username}`);
});



