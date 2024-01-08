const request = require('supertest');
const { app } = require('../src/server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

beforeAll(async () => {
    mongoose.connect = jest.fn();
    bcrypt.hash = jest.fn().mockResolvedValue('mockHashedPassword');
    mongoose.disconnect = jest.fn();
});

User.findOne = jest.fn(); 

describe('POST /register', () => {
    it('should register a new user successfully', async () => {
        User.findOne.mockResolvedValue(null); // Simulates user does not exist
        User.prototype.save = jest.fn().mockResolvedValue({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'mockHashedPassword',
            role: ['attendee'],
            location: 'Test City',
        });

        const res = await request(app)
            .post('/register')
            .send({
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                role: ['attendee'],
                location: 'Test City',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('username', 'newuser');
    }, 10000);

    it('should fail registration with existing email', async () => {
        User.findOne.mockResolvedValue({ email: 'existing@example.com' }); // Simulates user exists

        const res = await request(app)
            .post('/register')
            .send({
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123',
                role: ['attendee'],
                location: 'Test City',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email already in use. ');
    });

    
    it('should handle errors during registration', async () => {
        User.findOne.mockRejectedValue(new Error('Database error')); 

        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: ['attendee'],
                location: 'Test City',
            });

        expect(res.statusCode).toEqual(500); 
        expect(res.body).toHaveProperty('error');
    });

});
