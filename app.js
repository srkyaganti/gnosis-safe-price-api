const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const priceRouter = require('./routes/usd-price');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/price', priceRouter);

module.exports = app;
