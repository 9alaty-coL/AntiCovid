const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenMiddleware = require('../middleware/authen');

const AuthenController = require('../app/controllers/AuthenController');
const { detectRole } = require('../app/controllers/AuthenController');

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

router.get('/', detectRole);

router.delete('/logout', authenMiddleware.isLoggedIn, AuthenController.logout);

module.exports = router;
