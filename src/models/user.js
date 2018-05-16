const Promise = require('bluebird');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema; // eslint-disable-line
const genericModel = require('./generic_model');

/**
 * User Schema
 */
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'The value of path {PATH} ({VALUE}) is not a valid email.'], // eslint-disable-line no-useless-escape
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(genericModel);

/**
 * Add your

 * - validations
 * - virtuals
 */

/**
 * pre-save hooks
 */
UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

/**
 * Methods
 */
UserSchema.methods.comparePassword = function (passwordOne) {
  const password = this.password; // eslint-disable-line prefer-destructuring
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordOne, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

/**
 * Statics
 */

module.exports = mongoose.model('User', UserSchema);
