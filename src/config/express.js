/**
 * @author Ignacio Giagante, on 10/05/2018.
 */

const express = require('express');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const winstonInstance = require('winston');
const routes = require('../routers/router');
const settings = require('./settings');
const APIError = require('../helpers/APIError');

const app = express();

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(multer());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
// app.use(cors());

// enable detailed API logging in dev env
if (settings.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// log error in winston transports except when executing test suite
if (settings.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance,
  }));
}

// mount all routes on /api path
app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError(httpStatus.NOT_FOUND, 'API not found');
  return next(err);
});

// error handler
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json(JSON.stringify(err)));

module.exports = app;
