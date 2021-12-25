const Users = require('../models/User');
const Authens = require('../models/Authen');

let id;
let acc;
let user;
class UserController {
    async home(req, res, next) {
        id = req.params.id;
        acc = await Authens.one('_id', id);
        user = await Users.one('P_AccountID', id);
        res.redirect(`/user/${id}/infor`);
    }

    async information(req, res, next) { 
        let relatedPeople = [];
        let list = user.P_RelatedPersonID;
        for(let x of list) { 
            let person =  await Users.one('P_ID', x);
            relatedPeople.push(person);
        }

        res.render('user/information', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'information'],
            account: acc,
            user: user,
            relatedPeople: relatedPeople,
        });
    }

    async password(req, res, next) {
        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: user,
        });
    }

    async managedHistory(req, res, next) {
        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory'],
            user: user,
        });
    }

    async accountBalance(req, res, next) {
        res.render('user/accountBalance', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'accountBalance'],
            user: user,
        });
    }

    async deposit(req, res, next) {
        res.render('user/deposit', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'deposit'],
            user: user,
        });
    }

    async paidHistory(req, res, next) {
        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory'],
            user: user,
        });
    }
}

module.exports = new UserController();
