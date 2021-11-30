class AuthenController {
    signIn(req, res, next) {
        res.render('authen/signin', { css: 'signin' });
    }
}

module.exports = new AuthenController();
