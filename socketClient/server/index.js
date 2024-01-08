const io = require('socket.io-client');

require('dotenv').config({ path: '../../.env'});
const PORT = process.env.PORT || 5002;

const socket = io(`http://localhost:${PORT}`);

socket.on('connect', () => {
    console.log('Connected to server');

    // Simulate user registration
    const username = 'testUser'; // Example username
    socket.emit('register-user', { username: username });

    // Disconnect after registration
    socket.disconnect();
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});