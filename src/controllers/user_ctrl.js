

const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');
const settings = require('../config/settings');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

const userNotFound = 'USER_NOT_FOUND';

const debug = require('debug')('tradeApi:UserController');

const _createToken = function (user) {
  const payload = {
    sub: user._id, /* eslint no-underscore-dangle: 0 */
    iat: moment().unix(),
    exp: moment().add(1, 'days').unix(),
  };
  return jwt.encode(payload, settings.jwtSecret);
};

const signup = function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, msg: 'Please pass name and password.' });
  } else {
    const newUser = new User({
      firstname: 'pepe',
      lastname: 'almendra',
      email: 'pepe@gmaill.com',
      password: 'pepe',
    });

    newUser.save()
      .then(savedUser => res.status(200).json({ token: _createToken(savedUser) }))
      .catch((e) => {
        debug(`error : ${e}`);
        next(e);
      });
  }
};

const login = async function (req, res, next) {
  try {
    const user = await User.getByKeyAndValue('email', req.body.email);
    const success = await user.comparePassword(req.body.password);

    if (success) {
      // if user is found and password is right create a token
      const token = _createToken(user);
      // return the information including token as JSON
      return res.status(200).json({ token });
    }
    // res.status(403).send({message: wrongPassword});
    const err = new APIError(httpStatus.UNAUTHORIZED, 'Authentication error', 601, 'The password is not correct');
    return next(err);
  } catch (error) {
    // TODO: validate mongo errors
    const err = new APIError(httpStatus.UNAUTHORIZED, 'Authentication error', 601, 'The password is not correct');
    return next(err);
  }
};

const refreshToken = function (req, res, next) {
  User.getById(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.send({ message: userNotFound });
      }
      // if user is found, lets create a token
      const token = _createToken(user);
      // return the information including token as JSON
      return res.status(200).json({ token });
    })
    .catch(e => next(e));
};

module.exports = Object.assign({}, { signup, login, refreshToken });
