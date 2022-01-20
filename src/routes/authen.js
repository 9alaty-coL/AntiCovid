const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenMiddleware = require('../middleware/authen');

const AuthenController = require('../app/controllers/AuthenController');
const { detectRole } = require('../app/controllers/AuthenController');

router.get('/initAdmin', authenMiddleware.dnHavedAdmin, AuthenController.initAdmin);

router.post('/initAdmin', authenMiddleware.dnHavedAdmin, AuthenController.initAdminP);

router.get(
    '/sign-in',
    authenMiddleware.isNotLoggedIn,
    authenMiddleware.havedAdmin,
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
