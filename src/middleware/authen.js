const userM = require('../app/models/Authen');

class Authen {
    isLoggedIn(req, res, next) {
        if (req.path == '/sign-in') {
            return next();
        }
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/sign-in');
    }

    isNotLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        return next();
    }
}

module.exports = new Authen();
