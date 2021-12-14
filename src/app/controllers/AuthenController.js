const passport = require('passport');
const User = require('../models/User');
class AuthenController {
    signInG(req, res, next) {
        res.render('authen/signin', { css: ['signin'] });
    }

    signInP(req, res, next) {}
}

module.exports = new AuthenController();
