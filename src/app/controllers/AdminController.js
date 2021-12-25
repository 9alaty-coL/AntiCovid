const bcrypt = require('bcrypt');
const UserM = require('../models/User')
const Treatment = require('../models/Treatment')

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
        let treatment = await Treatment.all();

        res.render('admin/treatment', {
             layout: 'admin', 
             css: ['treatment'], 
             js: ['AdminPage'],
             treatment: treatment
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
}

module.exports = new AdminController();
