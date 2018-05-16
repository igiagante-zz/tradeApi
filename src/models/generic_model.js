let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    httpStatus = require('http-status'),
    APIError = require('../helpers/APIError');

let schema = mongoose.schema;

const genericSchema = function genericSchemaPlugin (schema, options) {

    const resolvePromise = (entity) => {
        if (entity) {
            return Promise.resolve(entity);
        }
        const err = new APIError('No such entity exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    }

    schema.add( { createdAt: {
        type: Date,
        default: Date.now
      }} );
  
    /**
     * Statics
     */
    schema.statics = {
        /**
         * Get entity by id
         * @param {ObjectId} id - The objectId of entity.
         * @returns {Promise<Entity, APIError>}
         */
        getById(id) {
            return this.findById(id)
                .exec()
                .then(resolvePromise);
        },

        /**
         * Get entity by name
         * @param {String} name - The entity's name.
         * @returns {Promise<User, APIError>}
         */
        getByKeyAndValue(key, value) {

            const queryObject = {};
            queryObject[key] = value;

            return this.findOne(queryObject)
                .exec()
                .then(resolvePromise);
        },

        /**
         * List entities in descending order of 'createdAt' timestamp.
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
        },

        cleanCollection() {
            this.remove({ });
        }
    };

    /**
     * Add virtuals
    */

    schema.virtual('id').get(function () { 
        return this._id;
    });

    schema.set('toJSON', { getters: true, virtuals: true });
}

module.exports = genericSchema;
