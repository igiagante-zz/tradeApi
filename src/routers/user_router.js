'use strict';

let express = require('express'),
    userCtrl = require('../controllers/user_ctrl');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.post('/refreshToken', userCtrl.refreshToken);

module.exports = router;