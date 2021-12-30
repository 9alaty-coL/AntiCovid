const passport = require('passport');
const User = require('../models/Authen');
class AuthenController {
    detectRole(req, res, next) {
        let user = req.user;
        if (user.role == 'admin') res.redirect('/admin');
        else if (user.role == 'manager') res.redirect(`/manager`);
        else if (user.role == 'user') res.redirect(`/user/${user._id}`);
        else res.redirect('/patient');
    }

    signInG(req, res, next) {
        res.render('authen/signin', { layout: 'authen', css: ['signin'] });
    }

    logout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}

module.exports = new AuthenController();
