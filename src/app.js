const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');
const app = express();
require('dotenv').config();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init mongodb
require('./dbs/init.mongodb');
// checkOverload()

//init routes
app.use('', require('./routes'));

//error handling

module.exports = app;
