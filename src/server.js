const express = require('express');
const logger = require('./utils/logger');
const notFound = require('./handlers/404');

require('dotenv').config();
const PORT = process.env.PORT || 5002;

const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});

app.use('*', notFound);

const start = () => {
    app.listen(PORT, () => {
        logger.info(`Server is running on PORT: ${PORT}`);
    });
};

module.exports = { app, start };