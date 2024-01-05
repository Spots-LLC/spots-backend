const express = require('express');
const logger = require('./utils/logger');

// error handlers
const notFound = require('./handlers/404');
const errorHandler = require('./handlers/500');

require('dotenv').config();
const PORT = process.env.PORT || 5002;

const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});

app.get('/error', (req, res, next) => {
    throw new Error('Forced Error for Testing');
});

app.use('*', notFound);
app.use(errorHandler);

const start = () => {
    app.listen(PORT, () => {
        logger.info(`Server is running on PORT: ${PORT}`);
    });
};

module.exports = { app, start };