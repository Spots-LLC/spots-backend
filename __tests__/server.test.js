const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, start, server } = require('../src/server'); 
const logger = require('../src/utils/logger');

jest.mock('../src/utils/logger'); 

const PORT = process.env.PORT || 5002;

describe('Server Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        process.env.MONGODB_URL = mongoUri; 
        await start(); 
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        server.close(); 
    });

    // Test the home route
    it('GET / responds with 200 and Hello World!', async () => {
        const response = await supertest(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World!');
    });

    // Test the error route
    it('GET /error responds with 500', async () => {
        const response = await supertest(app).get('/error');
        expect(response.statusCode).toBe(500);
    });

    // Test MongoDB connection logging
    it('logs a successful connection to MongoDB', async () => {
        // Mock mongoose.connect to simulate failure
        jest.spyOn(mongoose, 'connect').mockImplementation(() => {
            throw new Error('Mocked connection error');
        });

        try {
            await start();
        } catch (e) {
            // Nothing to do here, it's expected to throw
        }

        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error connecting to MongoDB'));
        mongoose.connect.mockRestore(); 
    });

    // Test server listening logging
    it('logs the server running port', () => {
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Server is running on PORT: ${PORT}`));
    });

});
