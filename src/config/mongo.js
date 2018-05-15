/**
 * @author Ignacio Giagante, on 10/05/2018.
 */

'use strict';

let mongoose = require('mongoose');
let settings = require('./settings.js');
const debug = require('debug')('tradeApi');
let util = require('util');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// print mongoose logs in dev env
if (settings.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

const connect = () => {

    return new Promise((resolve, reject) => {

        // connect to mongo db
        const mongoUri = settings.mongo.host;

        mongoose.connect(mongoUri, { useMongoClient: true });

        mongoose.connection.on('error', () => {
            reject(new Error(`unable to connect to database: ${mongoUri}`));
        });

        resolve('Connected successfully to MongoDB: ' + mongoUri);
    })
};

const cleanDB = () => {

    return new Promise((resolve, reject) => {

        // connect to mongo db
        const mongoUri = settings.mongo.host;

        mongoose.connect(mongoUri, { useMongoClient: true });

        mongoose.connection.on('error', () => {
            reject(new Error(`unable to connect to database: ${mongoUri}`));
        });

        resolve('Connected successfully to MongoDB: ' + mongoUri);
    })
};


module.exports = Object.assign({}, {connect});