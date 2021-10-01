require('dotenv').config();
const express = require('express');
const logger = require('morgan');

const invalidationModes = require('./constants/invalidation_modes');

const invalidationMode = process.env.INVALIDATION_MODE || invalidationModes.BLOCK_HEADERS;

const indexRouter = require('./routes/index');
const usdPriceRouter = require('./routes/usd_price');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/price', usdPriceRouter);

module.exports = app;
