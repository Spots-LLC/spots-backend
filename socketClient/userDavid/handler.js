const SocketClient = require('../lib/SocketClient');
const logger = require('../../src/utils/logger');
const Chance = require('chance');
const chance = new Chance();

const serverUrl = 'http://localhost:3001';
const username = 'davidthomas'; 

const client = new SocketClient(username, serverUrl);

client.socket.auth = { username };
client.socket.connect();

client.socket.on('users', (users) => {
    logger.info(`Users Online: ${users.map(u => u.username).join(', ')}`);
});

client.socket.on('connect', () => {
    logger.info(`Connected to server as ${username}`);
    const room = 'chatroom';
    client.socket.emit('joinRoom', {username, room});
});

client.socket.on('message', (message) => {
    logger.info(message);
});

setInterval(() => {
    const randomMessage = chance.sentence();
    client.socket.emit('message', { room: 'chatroom', message: `${username} says: ${randomMessage}` });
}, 5000);
