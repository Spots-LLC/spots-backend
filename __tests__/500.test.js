const supertest = require('supertest');
const { app } = require('../src/server');

describe('500 Internal Server Error Handler Tests', () => {
    const request = supertest(app);

    it('should return 500 for an internal server error', async () => {
        const response = await request.get('/error');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 500,
            route: '/error',
            message: 'An unexpected error occurred on the server.'
        });
    });
});