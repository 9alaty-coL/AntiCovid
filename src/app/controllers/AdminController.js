const bcrypt = require('bcrypt');
const UserM = require('../models/Authen')
const Treatment = require('../models/TreatmentPlaces')

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
    async treatment(req, res, next) {
        let itemsPerPage = 6;
        let currPage = req.query.page ? req.query.page : 1;
        let pages;
        let pageList = [];
        let treatment = await Treatment.all();
        pages = Math.ceil(treatment.length / itemsPerPage);

        for (let i = 1; i <= pages; i++){
            pageList.push({num: i});
        }

        pageList[currPage - 1].active = 1;

        treatment.forEach((value, index) => {
            value.index = index + 1;
        })
        treatment = treatment.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage);

        
        
        res.render('admin/treatment', {
             layout: 'admin', 
             css: ['treatment'], 
             js: ['AdminPage'],
             treatment: treatment,
             pageList: pageList,
             first: pages >=3 ? 1 : null,
             last: pages >=3 ? pages :null,
        });
    }

    // [GET] admin/treatment/create
    createTreatment(req, res, next){
        res.render('admin/treatment_create', {
            layout: 'admin', 
            css: ['treatment_create'], 
            js: ['AdminPage'],
        })
    }

    // [POST] admin/treatment/create
    async newTreatment(req, res, next){
        let place = await Treatment.insert(req.body);
        let message = "";
        let color = "";
        if (place){
            message = "Thêm thành công";
            color = "success";
        }
        else{
            message = "Có lỗi xảy ra :(("
            color = "danger";
        }
        res.render('admin/treatment_create', {
            layout: 'admin', 
            css: ['treatment_create'], 
            js: ['AdminPage'],
            message:message,
            color:color
        })
    }

    // [DELETE] admin/:id
    async deleteTreatment(req, res, next){
        let response = await Treatment.delete('_id', req.params.id);
        res.redirect('back')
    }

    // [GET] admin/treatment/:id/edit
    async editTreatment(req, res, next){
        let message = "";
        let color = "";
        let treatment = await Treatment.getTreatmentById(req.params.id);
        if (!treatment) {
            message = "Treatment no found";
            color = "danger";
        }
        res.render('admin/treatment_edit',{
            treatment: treatment,
            layout: 'admin', 
            css: ['treatment_edit'], 
            js: ['AdminPage'],
            message:message,
            color:color
        })
    }

    // [PUT] admin/treatment/:id/editTreatment
    async updateTreatment(req, res, next) {
        let message = "";
        let color = "";
        req.body._id = req.params.id;
        let treatment = await Treatment.update( req.body);
        if (!treatment) {
            message = "Update failed";
            color = "danger";
        }
        else{
            message = "Update successfully"
            color="success";
        }
        res.render('admin/treatment_edit',{
            treatment: treatment,
            layout: 'admin', 
            css: ['treatment_edit'], 
            js: ['AdminPage'],
            message:message,
            color:color
        })
    }

    // [GET] admin/manage
    async manage(req, res, next) {
        let itemsPerPage = 6;
        let currPage = req.query.page ? req.query.page : 1;
        let pages;
        let pageList = [];
        let account = await UserM.getManagerAccounts();
        pages = Math.ceil(account.length / itemsPerPage);

        for (let i = 1; i <= pages; i++){
            pageList.push({num: i});
        }

        pageList[currPage - 1].active = 1;

        account.forEach((value, index) => {
            value.index = index + 1;
        })
        account = account.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage);

        // let accounts = await UserM.getManagerAccounts();
        // accounts.forEach((value, index) => {
        //     value.index = index + 1;
        // })

        res.render('admin/manage', {
            account: account,
            layout:'admin',
            css: ['manage'],
            js: ['AdminPage'],
            pageList: pageList,
            first: pages >=3 ? 1 : null,
            last: pages >=3 ? pages :null,
        })
    }

    // [PUT] /admin/lock/:id
    async lock(req, res, next) {
        let us = await UserM.getUserById(req.params.id);
        // us.isLocked = true;
        let response = await UserM.update(us);

        res.redirect('back');
    }

    // [PUT] /admin/unlock/:id
    async unlock(req, res, next) {

    }
}



module.exports = new AdminController();
