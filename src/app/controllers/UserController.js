class UserController {
    home(req, res, next) {
        res.render('user/home', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage'],
        });
    }
}

module.exports = new UserController();
