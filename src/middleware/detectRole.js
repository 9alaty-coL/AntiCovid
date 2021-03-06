class Detect {
    isAdmin(req, res, next) {
        if (req.user.role === 'admin') {
            return next();
        }
        res.redirect('/');
    }

    isManager(req, res, next) {
        if (req.user.role === 'manager') {
            return next();
        }
        res.redirect('/');
    }

    isUser(req, res, next) {
        if (req.user.role === 'user') {
            return next();
        }
        res.redirect('/');
    }
}

module.exports = new Detect();
