require('dotenv').config();
const express = require('express');
const logger = require('morgan');

const invalidationModes = require('./constants/invalidation_modes');
const invalidationMode = process.env.INVALIDATION_MODE || invalidationModes.BLOCK_HEADERS;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.json({ title: 'Express App' });
});

app.post('/price', (req, res, next) => {
    res.json({ title: 'Express App' });
});

module.exports = app;
