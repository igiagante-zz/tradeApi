'use strict';

let mongoose = require('mongoose');
let util = require('util');

// config should be imported before importing any other file
let app = require('./config/express');
let mongo = require('./config/mongo');
let settings = require('./config/settings');

mongo.connect().then((result) => {

    console.log(result);

    app.listen(settings.port);
    console.log(`Server started succesfully, running on port: ${settings.port}. \n \n`);

}).catch(e => console.log(' Something was wrong ' + e));

module.exports = app;