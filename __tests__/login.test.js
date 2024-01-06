const request = require('supertest');
const { app } = require('../src/server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

beforeAll(async () => {
    mongoose.connect = jest.fn();
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    mongoose.disconnect = jest.fn();
});

describe('POST /login', () => {
    it('should log in a user successfully', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            _id: 'someUserId',
            username: 'existinguser',
            password: 'mockHashedPassword',
        });

        const res = await request(app)
            .post('/login')
            .send({
                username: 'existinguser',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with non-existent user', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app)
            .post('/login')
            .send({
                username: 'nonexistentuser',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User does not exist.');
    });

    it('should fail login with incorrect password', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            username: 'existinguser',
            password: 'mockHashedPassword',
        });
        bcrypt.compare = jest.fn().mockResolvedValue(false); 

        const res = await request(app)
            .post('/login')
            .send({
                username: 'existinguser',
                password: 'incorrectPassword',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid Credentials. ');
    });

    it('should handle errors during login', async () => {
        User.findOne.mockRejectedValue(new Error('Database error')); 

        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(500); 
        expect(res.body).toHaveProperty('error');
    });
});
