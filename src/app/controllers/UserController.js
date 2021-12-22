class UserController {
    home(req, res, next) {
        res.redirect('/user/infor');
    }

    information(req, res, next) {
        res.render('user/information', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'information'],
        });
    }

    password(req, res, next) {
        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
        });
    }

    managedHistory(req, res, next) {
        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory'],
        });
    }

    accountBalance(req, res, next) {
        res.render('user/accountBalance', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'accountBalance'],
        });
    }

    deposit(req, res, next) {
        res.render('user/deposit', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'deposit'],
        });
    }

    paidHistory(req, res, next) {
        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory'],
        });
    }
}

module.exports = new UserController();
