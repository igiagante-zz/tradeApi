let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    httpStatus = require('http-status'),
    APIError = require('../helpers/APIError'),
    bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;
let genericModel = require('./generic_model');

/**
 * User Schema
 */
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'The value of path {PATH} ({VALUE}) is not a valid email.']
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gardensIds: [{_id: Schema.Types.ObjectId}]
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
UserSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

/**
 * Methods
 */
UserSchema.methods.comparePassword = function (passwordOne) {

    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(passwordOne, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    })
};

/**
 * Statics
 */

module.exports = mongoose.model('User', UserSchema);
