const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenMiddleware = require('../middleware/authen');

const AuthenController = require('../app/controllers/AuthenController');

router.get(
    '/sign-in',
    authenMiddleware.isNotLoggedIn,
    AuthenController.signInG,
);

router.post(
    '/sign-in',
    authenMiddleware.isNotLoggedIn,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    }),
);

router.get('/', (req, res, next) => {
    let user = req.user;
    if (user.role == 'admin') res.send('admin');
    else if (user.role == 'manager') res.send('manager');
    else res.send('patient');
});

module.exports = router;
