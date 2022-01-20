const userM = require('../app/models/Authen');
const bcrypt = require('bcrypt')
class Authen {
    async isLoggedIn(req, res, next) {
        if (req.path == '/sign-in'  || req.path == '/initAdmin') {
            return next();
        }
        if (req.isAuthenticated()) {
            if(req.path == '/logout'){return next();}
            if(req.user.role == 'user' && (await bcrypt.compare('0', req.user.password) && req.path != '/user/'+req.user._id+'/pwd')){
                // console.log(req.path);
                return res.redirect('/user/'+req.user._id+'/pwd')
            }
            if(req.user.role == 'manager' && (await bcrypt.compare('0', req.user.password) && req.path != '/manager/pwd')){
                return res.redirect('/manager/pwd')
            }
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

    async havedAdmin(req, res, next) {
        let us = await userM.one('role', 'admin')
        if(us){
            return next();
        }
        else{
            res.redirect('/initAdmin')
        }    
    }

    async dnHavedAdmin(req, res, next) {
        let us = await userM.one('role', 'admin')
        if(us)
        {
            return res.redirect('/sign-in')
        }
        else{
            return next()
        }  
    }
}

module.exports = new Authen();
