'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

let modelContainer = {};

modelContainer.init = function() {

  return mongoose.connect('mongodb://localhost/trade-test')
    .then(() => {
      return doSomeMoreAsyncStuff();
    })
    .then(someResult => {
      const UserSchema = require('./schemas/user')(someResult);
      return {
        User: ic.mongoose.model('User', UserSchema)
      };
    });
};

module.exports = modelContainer;