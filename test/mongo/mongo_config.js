'use strict';

let mongoose = require('mongoose');
let settings = require('../../src/config/settings');
const debug = require('debug')('tradeApi');
let util = require('util');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

/**
* Provide functions to connect to mongoDB, initialize and clean database
*/
const connectionTest = () => {

    // connect to mongo db
    // TODO: move this const to some env var
    const mongoUri = "mongodb://localhost/trade-test";

    const connection = () => {

        return new Promise((resolve, reject) => {

            if (mongoose.connection.readyState === 0) {
                mongoose.connect(mongoUri, { useMongoClient: true });
    
                mongoose.connection.on('error', (error) => {
                    reject(new Error(`unable to connect to database: ${mongoUri}`));
                });
            }
    
            resolve(mongoose.connection);
        })
    }

    const cleanDB = (data) => {

        return connection()
            .then(db => db.collections)
            .then(collections => {
                const requests = Object.keys(data).map(col => {
                    return collections[col].remove({});
                  })
                return Promise.all(requests);
            }).catch(e => console.log('Mongoose Error : '  + e));
    };

    const initDB = (data) => {

       return connection().then(
            db => {
                
                const requests = Object.keys(data).map(col => {
                    const collection = db.collection(col);
                    return data[col].map(item => {
                        collection.save(item);
                    });
                  })

                return Promise.all(requests);
            }
        ).catch(e => 
            console.log('Mongoose Error : ' + e)
        );
    };

    return Object.assign({}, { connection, initDB, cleanDB });
}

module.exports = connectionTest();