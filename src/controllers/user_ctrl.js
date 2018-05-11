'use strict';

let User = require('../models/user'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    settings = require('../config/settings'),
    APIError = require('../helpers/APIError'),
    httpStatus = require('http-status');

let invalidUser = 'INVALID_USER';
let userNotFound = 'USER_NOT_FOUND';
let wrongPassword = 'WRONG_PASSWORD';

let _createToken = function(user) {
    let payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix()
    };
    return jwt.encode(payload, settings.jwtSecret);
};

let signup = function(req, res, next) {

    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {

        let newUser = new User({
            name: req.body.username,
            password: req.body.password
        });

        newUser.save()
            .then(savedUser => {
                    return res.status(200).json({token: _createToken(savedUser)})
                }
            )
            .catch(e => next(e));
    }
};

let login = async function(req, res, next) {

    try {

        let user = await User.getByName(req.body.username);
        let success = await user.comparePassword(req.body.password);

        if (success) {
            // if user is found and password is right create a token
            let token = _createToken(user);
            // return the information including token as JSON
            return res.status(200).json({token: token});
        } else {
            //res.status(403).send({message: wrongPassword});
            const err = new APIError(httpStatus.UNAUTHORIZED, 'Authentication error', 601,  'The password is not correct');
            return next(err);
        }
    } catch (error) {
        const err = new APIError(httpStatus.UNAUTHORIZED, 'Authentication error', 601,  'The password is not correct');
        return next(err);
    }
};

let refreshToken = function(req, res, next) {

    User.getById(req.body.userId)
        .then( user => {
            if (!user) {
                res.send({message: userNotFound});
            } else {
                // if user is found, lets create a token
                let token = _createToken(user);
                // return the information including token as JSON
                return res.status(200).json({token: token});
            }
        })
        .catch(e => next(e));
};

module.exports = Object.assign({}, {signup, login,refreshToken} );