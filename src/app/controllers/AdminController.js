const bcrypt = require('bcrypt');
const UserM = require('../models/User')

class AdminController {

    // [GET] /admin
    home(req, res, next) {
        res.render('admin/home', {
            layout: 'admin',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    // [GET] /admin/create
    create(req, res, next) {
        res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage']});
    }

    // [POST] /admin/create
    async newAccount(req, res, next) {
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
        req.body.password = await bcrypt.hash(req.body.password, 10);

        await UserM.insert(req.body);

        res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage'], message:mess, color:cl})
    }

    // [GET] admin/treatment
    treatment(req, res, next) {
        res.render('admin/treatment', {
             layout: 'admin', 
             css: ['treatment'], 
             js: ['AdminPage'],
             treatment: [{name:'Bệnh viện dã chiến', capacity:20000, current:15000}]
        });
    }

    // [GET] admin/treatment/create
    createTreatment(req, res, next){
        res.render('admin/treatment_create', {
            layout: 'admin', 
            css: ['treatment'], 
            js: ['AdminPage'],
        })
    }

    // [POST] admin/treatment/create
    newTreatment(req, res, next){

    }
}

module.exports = new AdminController();
