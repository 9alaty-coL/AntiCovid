const passport = require('passport');
const User = require('../models/Authen');
const bcrypt = require('bcrypt')
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

    initAdmin(req, res, next) {
        res.render('authen/signup', { layout: 'authen', css: ['signin'] });
    }

    async initAdminP(req, res, next) {

        let pwd = await bcrypt.hash(req.body.password, 10)
        let id = await User.nextID()
        let admin = {
            _id:id,            
            username: req.body.username,
            password: pwd,
            role: 'admin',
            isLocked: 'false'
        }

        await User.insert(admin)

        res.redirect('/')
    }

    logout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}

module.exports = new AuthenController();
