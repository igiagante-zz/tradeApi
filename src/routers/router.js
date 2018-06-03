
const express = require('express');
const jwt = require('jwt-simple');
const settings = require('../config/settings');

// Routers
const userRouter = require('./user_router');
const tradeNoteRouter = require('./tradeNote_router');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api - Check service health */
router.get('/', (req, res) =>
  res.send('server is UP!'));

// middleware to use for all requests in order to verify if the user is authorized
const isUserAuthenticated = function (req, res, next) {
  const token = req.headers.token; // eslint-disable-line prefer-destructuring
  if (!token) {
    return res
      .status(403)
      .send({ message: 'Your request does not have header Authorization' });
  }

  try {
    jwt.decode(token, settings.jwtSecret);
    return next();
  } catch (error) {
    return res.status(403).send({ message: `Authentication failed. ${error}` });
  }
};

router.get('/secret', isUserAuthenticated, (req, res) => {
  res.json('Success! You can not see this without a token');
});

router.use('/users', userRouter);
router.use('/tradeNotes', tradeNoteRouter);

module.exports = router;
