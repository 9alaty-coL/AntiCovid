const passport = require('passport');
const User = require('../models/User');
class AuthenController {
    detectRole(req, res, next) {
        let user = req.user;
        if (user.role == 'admin') res.redirect('/admin');
        else if (user.role == 'manager') res.redirect('/manager');
        else res.redirect('/patient');
    }

    signInG(req, res, next) {
        res.render('authen/signin', { layout: 'authen', css: ['signin'] });
    }
}

module.exports = new AuthenController();
