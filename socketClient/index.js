const io = require('socket.io-client');


const socket = io('http://localhost:3001');

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