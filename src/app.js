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

// init mongodb
require('./dbs/init.mongodb');
// checkOverload()

//init routes
app.get('/', (req, res) => {
  const strCompress = 'Hello compress';
  return res.status(200).json({
    message: strCompress,
    metadata: strCompress.repeat(1000000),
  });
});

//error handling

module.exports = app;
