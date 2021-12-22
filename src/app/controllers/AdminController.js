const bcrypt = require('bcrypt');
const UserM = require('../models/User')
const randomID = require('../../utils/randomID')

class AdminController {
    home(req, res, next) {
        res.render('admin/home', {
            layout: 'admin',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    create(req, res, next) {
        res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage']});
    }

    async new(req, res, next) {
        let mess = '';
        let cl = '';
        let us = await UserM.getUserByUN(req.body.username);
        if (us)
        {
            mess = 'User already exists';
            cl = 'danger'
            return res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage'], message:mess, color:cl})
        }
        
        mess = 'Create manager account sucessfully!';
        cl = 'success';

        let i = 1;
        
        req.body.role = 'manager';
        req.body._id = await randomID('Users');
        req.body.password = await bcrypt.hash(req.body.password, 10);

        await UserM.insert(req.body);

        res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage'], message:mess, color:cl})
    }
}

module.exports = new AdminController();
