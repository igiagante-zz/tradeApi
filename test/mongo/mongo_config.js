'use strict';

let mongoose = require('mongoose');
let settings = require('../../src/config/settings');
const debug = require('debug')('tradeApi');
let util = require('util');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

const connectionTest = () => {

    // connect to mongo db
    const mongoUri = "mongodb://localhost/trade-test";//settings.mongo.host;

    const connect = () => {

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

        setTimeout(() => {

        connect()
            .then(db => {
                
                console.log('db.collections : ' + db.collections);
                return db.collections;
            })
           
            .then(collections => {
                const requests = Object.keys(data).map(col => {
                    console.log('Deleting collection : ' + collections[col]);
                    return collections[col].remove({});
                  })
                return Promise.all(requests);
            }).catch(e => console.log(`unable to connect to database: ${mongoUri} ` + e));

        }, 1000);
    };

    const initDB = (data) => {

        connect().then(
            db => {
                const requests = Object.keys(data).map(col => {
                    const collection = db.collection(col);
                    console.log('collection : ' + collection);
                    return collection.insert(data[col]);
                  })
                  return Promise.all(requests) ;
            }
        ).catch(e => console.log(`unable to connect to database: ${mongoUri} ` + e));
    
      }

    return Object.assign({}, {initDB, cleanDB});
}

module.exports = connectionTest();