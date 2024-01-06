const supertest = require('supertest');
const { app } = require('../src/server');

describe('404 notFound Handler Tests', () => {
    const request = supertest(app);

    it('should return 404 for non-existent route', async () => {
        const response = await request.get('/non-existent-route');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: 404,
            route: '/non-existent-route',
            method: 'GET',
            message: 'The requested resource was not found on this server.'
        });
    });
});