
let express = require('express');
let jwt = require('jwt-simple');
let util = require('util');
let userRouter = require('./user_router');
let settings = require('../config/settings');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api - Check service health */
router.get('/', (req, res) =>
    res.send('server is UP!')
);

// middleware to use for all requests in order to verify if the user is authorized
let isUserAuthenticated = function (req, res, next) {

    let token = req.headers.token;
    if (!token) {
        return res
            .status(403)
            .send({message: "Your request does not have header Authorization"});
    }

    try {
        jwt.decode(token, settings.jwtSecret);
        next();
    } catch (error) {
        return res.status(403).send({message: 'Authentication failed. ' + error});
    }
}; 

router.get("/secret", isUserAuthenticated, function(req, res){
    res.json("Success! You can not see this without a token");
});

router.use('/users', userRouter);

module.exports = router;