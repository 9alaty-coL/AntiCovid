const Users = require('../models/User');
const Authens = require('../models/Authen');
const Bills = require('../models/Bill');
const LocationHistory = require('../models/LocationHistory');
const StatusHistory = require('../models/StatusHistory');
const bcrypt = require('bcrypt');

var currDate = new Date();

let id;
let acc;
let user;
let listOfBills;
let paidBills;
let notPaidBills;
let status = [];
let location = [];
const saltRounds = 10;
class UserController {
    async home(req, res, next) {
        id = req.params.id;

        acc = await Authens.one('_id', id);

        user = await Users.one('P_ID', id);

        listOfBills = await Bills.getBillsByUserID(id) 
        for(let i = 0; i < listOfBills.length; i++) {
            let tokens = listOfBills[i].B_Datetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            listOfBills[i].B_Date = date;
            listOfBills[i].B_Time = time;
        }

        paidBills = listOfBills.filter(bill => bill.B_IsPaid == true)
        
        notPaidBills = listOfBills.filter(bill => bill.B_IsPaid == false)
        
        const statusHistory = await StatusHistory.one('P_ID', id)
        for (let i = 0; i < statusHistory.StatusChange.length; i++) {
            status[i] = {
                StatusChange : statusHistory.StatusChange[i],
                Time : statusHistory.Time[i],
            }
        }


        const locationHistory = await LocationHistory.one('P_ID', id);
        for (let i = 0; i < locationHistory.HospitalLocation.length; i++) {
            location[i] = {
                HospitalLocation : locationHistory.HospitalLocation[i],
                Time : locationHistory.Time[i],
            }
        }
        
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
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/pwd
    password(req, res, next) {
        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: user,
            color: '',
            message: '',
            notPaidBills: notPaidBills,
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
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/mHistory
    async managedHistory(req, res, next) {
        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory'],
            user: user,
            notPaidBills: notPaidBills,
            status: status,
            location: location,
        });
        return;
    }

    // GET /user/:id/accBal
    async accountBalance(req, res, next) {
        res.render('user/accountBalance', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'accountBalance'],
            user: user,
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/deposit
    async deposit(req, res, next) {
        res.render('user/deposit', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'deposit'],
            user: user,
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/pHistory
    paidHistory(req, res, next) {
        for(let i = 0; i < paidBills.length; i++) {
            let tokens = paidBills[i].B_PaymentDatetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            paidBills[i].B_PaymentDate = date;
            paidBills[i].B_PaymentTime = time;
        }

        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory'],
            user: user,
            paidbills: paidBills,
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/package
    async package(req, res, next) {
        res.render('user/package', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'package'],
            user: user,
            notPaidBills: notPaidBills,
        });
        return;
    }

    // GET /user/:id/package/:p_id
    async packageDetail(req, res, next) {
        res.render('user/packageDetail', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'detail'],
            user: user,
            notPaidBills: notPaidBills,
        });
        return;
    }

     // GET /user/:id/package/:p_id
     async productDetail(req, res, next) {
        res.render('user/productDetail', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'detail'],
            user: user,
            notPaidBills: notPaidBills,
        });
        return;
    }

    buyHistory(req, res, next) {
        res.render('user/buyHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'buyHistory'],
            user: user,
            paidBills: paidBills,
            notPaidBills: notPaidBills,
        });
        return;
    }
}

module.exports = new UserController();
