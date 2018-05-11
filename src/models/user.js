let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    httpStatus = require('http-status'),
    APIError = require('../helpers/APIError'),
    bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gardensIds: [{_id: Schema.Types.ObjectId}],
    createdAt: {
        type: Date,
        default: Date.now
    }
});



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

    console.log('user this : ' + this);
    console.log('user this.password : ' + this.password);

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
UserSchema.statics = {
    /**
     * Get user by id
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    getById(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * Get user by name
     * @param {String} name - The user's name.
     * @returns {Promise<User, APIError>}
     */
    getByName(name) {
        return this.findOne({ name: name })
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
