/**
 * @author Ignacio Giagante, on 10/05/2018.
 */

'use strict';

let httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
    constructor(status, errorType, errorCode, message) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.errorType = errorType;
        this.errorCode = errorCode;
        this.message = message;
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {number} status - HTTP status code of error.
     * @param {string} errorType - Type of error.
     * @param {number} errorCode - Internal error code.
     * @param {string} errorMessage - Error message.
     */
    constructor(status = httpStatus.INTERNAL_SERVER_ERROR, errorType, errorCode = httpStatus.INTERNAL_SERVER_ERROR, errorMessage = '') {
        super(status, errorType, errorCode, errorMessage);
    }
}

module.exports = APIError;