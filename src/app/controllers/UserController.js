const Users = require('../models/User');
const Authens = require('../models/Authen');
const bcrypt = require('bcrypt');

let id;
let acc;
let user;
const saltRounds = 10;
class UserController {
    async home(req, res, next) {
        id = req.params.id;
        acc = await Authens.one('_id', id);
        user = await Users.one('P_AccountID', id);
        res.redirect(`/user/${id}/infor`);
        return;
    }

    // GET /user/:id/infor
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
        return;
    }

    // GET /user/:id/pwd
    async password(req, res, next) {
        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: user,
            color: '',
            message: '',
        });
        return;
    }

    // Post /user/:id/pwd
    async changePassword(req, res, next) {
        let message ;
        let color;

        const password = req.body.currpwd;
        const newPassword = req.body.newpwd;
        const confirm = req.body.confirm;
        const pwdHashed = await bcrypt.hash(newPassword, saltRounds);
        const challengeResult = await bcrypt.compare(password, acc.password)
        
        
        if(password ==='' || newPassword ==='' || confirm === '') {
            message = 'Vui lòng điền đầy đủ tất cả thông tin';
            color = 'red';
        }
        else if (!challengeResult) {
            message = 'Mật khẩu hiện tại bạn nhập không đúng';
            color = 'red';
        }
        else if(newPassword !== confirm) {
            message = 'Xác nhận nhận mật khẩu mới không trùng khớp';
            color = 'red';
        }
        else {
            let user = {
                _id: id,
                password: pwdHashed,
            }

            const res = await Authens.update(user);
            console.log(res)
            message = 'Đổi mật khẩu thành công';
            color = 'green';
            acc = await Authens.one('_id', id);
        }


        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: user,
            color: color,
            message: message,
        });
        return;
    }

    async managedHistory(req, res, next) {
        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory'],
            user: user,
        });
        return;
    }

    async accountBalance(req, res, next) {
        res.render('user/accountBalance', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'accountBalance'],
            user: user,
        });
        return;
    }

    async deposit(req, res, next) {
        res.render('user/deposit', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'deposit'],
            user: user,
        });
        return;
    }

    async paidHistory(req, res, next) {
        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory'],
            user: user,
        });
        return;
    }
}

module.exports = new UserController();
