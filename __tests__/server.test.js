const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, start } = require('../src/server');
const logger = require('../src/utils/logger');

jest.mock('../src/utils/logger');

describe('Server Tests', () => {
    let mongoServer;
    let serverInstance; 
    const request = supertest(app);

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // Mocks app.listen to prevent the server from actually starting
        app.listen = jest.fn((port, callback) => {
            serverInstance = { close: jest.fn() }; 
            callback(); 
            return serverInstance;
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        if (serverInstance && serverInstance.close) {
            serverInstance.close(); 
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });


    it('should return 200 for the home route', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    });

    // Test for MongoDB connection
    it('should connect to MongoDB', async () => {
        const isConnected = mongoose.connection.readyState;
        expect(isConnected).toBe(1); // 1 for connected
    });

    it('logs a successful connection to MongoDB', async () => {
        const mongooseConnectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValue();

        await start();

        expect(mongooseConnectSpy).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Connected to MongoDB');
        expect(app.listen).toHaveBeenCalled(); 
    });


    it('logs an error if MongoDB connection fails', async () => {
        const error = new Error('Connection failed');
        jest.spyOn(mongoose, 'connect').mockRejectedValue(error);

        await start();

        expect(logger.error).toHaveBeenCalledWith(`Error connecting to MongoDB: ${error.message}`);

    });

});

