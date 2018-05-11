/**
 * @author Ignacio Giagante, on 10/05/2018.
 */

'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    httpStatus = require('http-status'),
    expressWinston = require('express-winston'),
    helmet = require('helmet'),
    winstonInstance = require('winston'),
    routes = require('../routers/router'),
    settings = require('./settings'),
    APIError = require('../helpers/APIError');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
//app.use(cors());

// enable detailed API logging in dev env
if (settings.env === 'development') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
}

// log error in winston transports except when executing test suite
if (settings.env !== 'test') {
    app.use(expressWinston.errorLogger({
        winstonInstance
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
app.use((err, req, res, next) =>  res.status(err.status).json(JSON.stringify(err)) );

module.exports = app;