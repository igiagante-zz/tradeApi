const Promise = require('bluebird');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


const genericSchema = function genericSchemaPlugin(schema, options) { // eslint-disable-line
  const resolvePromise = (entity) => {
    if (entity) {
      return Promise.resolve(entity);
    }
    const err = new APIError('No such entity exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  };

  schema.add({
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  /**
     * Statics
     */
  schema.statics = { // eslint-disable-line no-param-reassign
    /**
         * Get entity by id
         * @param {ObjectId} id - The entity's objectId.
         * @returns {Promise<Entity, APIError>}
         */
    getById(id) {
      return this.findById(id)
        .exec()
        .then(resolvePromise);
    },

    /**
         * Get entity by key and value
         * @param {String} key - Object's key.
         * @param {String} value - Key's value.
         * @returns {Promise<Entity, APIError>}
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
         * @param {number} skip - Number of entities to be skipped.
         * @param {number} limit - Limit number of entities to be returned.
         * @returns {Promise<Entity[]>}
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
    },
  };

  /**
     * Add virtuals
    */
  schema.virtual('id').get(function () {
    return this._id; // eslint-disable-line no-underscore-dangle
  });

  schema.set('toJSON', { getters: true, virtuals: true });
};

module.exports = genericSchema;
