const bcrypt = require('bcrypt');
const UserM = require('../models/Authen')
const Activity = require('../models/Manager')
const Treatment = require('../models/TreatmentPlaces')
const StatusHistory = require('../models/StatusHistory')
const LocationHistory = require('../models/LocationHistory')
const PatientM = require('../models/User')

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
            mess = 'Tên tài khoản đã tồn tại';
            cl = 'danger'
            return res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage'], message:mess, color:cl})
        }
        
        mess = 'Tạo tài khoản người quản lý thành công';
        cl = 'success';

        let i = 1;
        
        req.body.role = 'manager';
        // req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.password = await bcrypt.hash('0', 10);
        req.body.isLocked = 'false';
        let newID = await UserM.nextID()
        var newManager = {
            _id:newID,
            username: req.body.username,
            password: '0',
            isLocked: 'false',
            role:'manager'
        }

        await UserM.insert(newManager);

        res.render('admin/create', { layout: 'admin', css: ['create'], js: ['AdminPage'], message:mess, color:cl})
    }

    // [GET] admin/treatment
    async treatment(req, res, next) {
        let itemsPerPage = 7;
        let currPage = req.query.page ? req.query.page : 1;
        let pages;
        let pageList = [];
        let treatment = await Treatment.all();
        pages = Math.ceil(treatment.length / itemsPerPage) == 0 ? 1 : Math.ceil(treatment.length / itemsPerPage);

        for (let i = 1; i <= pages; i++){
            pageList.push({num: i});
        }

        pageList[currPage - 1].active = 1;

        treatment.forEach((value, index) => {
            value.index = index + 1;
        })
        treatment = treatment.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage);

        
        
        let first = {}; let last =  {};
        first.page = 1;
        last.page = pages;
        if (currPage == pages){
            last.state = 'disabled';
        }
        if (currPage == 1){
            first.state = 'disabled';
        }

        res.render('admin/treatment', {
             layout: 'admin', 
             css: ['treatment'], 
             js: ['AdminPage'],
             treatment: treatment,
             pageList: pageList,
             first: first,
             last: last
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
        let itemsPerPage = 7;
        let currPage = req.query.page ? req.query.page : 1;
        let pages;
        let pageList = [];
        let account = await UserM.getManagerAccounts();

        let acc1 = []; let acc2 = [];
        account.forEach(value=>{
            if (value.isLocked){
                acc2.push(value);
            }
            else{
                acc1.push(value);
            }
        })
        account = [...acc1, ...acc2];

        pages = Math.ceil(account.length / itemsPerPage) == 0 ? 1 : Math.ceil(account.length / itemsPerPage);

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

        let first = {}; let last =  {};
        first.page = 1;
        last.page = pages;
        if (currPage == pages){
            last.state = 'disabled';
        }
        if (currPage == 1){
            first.state = 'disabled';
        }

        res.render('admin/manage', {
            account: account,
            layout:'admin',
            css: ['manage'],
            js: ['AdminPage'],
            pageList: pageList,
            first:first,
            last: last,
        })
    }

    // [PUT] /admin/lock/:id
    async lock(req, res, next) {

        let us = {_id: req.params.id, isLocked: 'true'}
        let response = await UserM.update(us);
        res.redirect('back');
    }

    // [PUT] /admin/unlock/:id
    async unlock(req, res, next) {

        let us = {_id: req.params.id, isLocked: 'false'}
        let response = await UserM.update(us);
        res.redirect('back');
    }

    // [GET] /admin/history/:id
    async history(req, res, next){
        let itemsPerPage = 7;
        let currPage = req.query.page ? req.query.page : 1;
        let pages;
        let pageList = [];

        let manager = await UserM.getUserById(req.params.id)
        let manageLog = await Activity.one('M_ID', req.params.id)
        let status = await StatusHistory.all();
        let location = await LocationHistory.all();

        let statusH = await statusHistory(status, req.params.id); // StatusHistory
        let locationH = await locationHistory(location, req.params.id); // LocationHistory
        let activity = [...manageHistory(manageLog), ...statusH, ...locationH];


        sortByDate(activity);
        
        //pagination
        pages = Math.ceil(activity.length / itemsPerPage) == 0 ? 1 : Math.ceil(activity.length / itemsPerPage);

        for (let i = 1; i <= pages; i++){
            pageList.push({num: i});
        }

        pageList[currPage - 1].active = 1;

        activity.forEach((value, index) => {
            value.index = index + 1;
        })
        activity = activity.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage);


        let first = {}; let last =  {};
        first.page = 1;
        last.page = pages;
        if (currPage == pages){
            last.state = 'disabled';
        }
        if (currPage == 1){
            first.state = 'disabled';
        }

        res.render('admin/manage_history', {
            manager: manager,
            layout:'admin',
            css: ['history'],
            js: ['AdminPage'],
            activity: activity,
            first:first,
            last:last,
            pageList: pageList,
            id:req.params.id,
        })
    }

}

function manageHistory(manager){
    let activity = [];
    if (!manager || !manager.TimeLog){
        return activity;
    }
    else{
        manager.TimeLog.forEach((value, index) => {
            manager.Activity
            activity.push({
                TimeLog: value,
                Activity: manager.Activity[index],
                ActivityDetail: manager.ActivityDetail[index],
            });
        })
    }
    
    return activity;
}

async function statusHistory(table, id){
    let activity = [];
    if(!table){
        return activity;
    }

    for (let i in table){
        if (table[i].Manager_ID){
            for (let j in table[i].Manager_ID){
                if (table[i].Manager_ID[j] == id){
                    const patient = await PatientM.one('P_ID', table[i].P_ID);
                    const obj = {};
                    obj.TimeLog = table[i].Time[j];
                    obj.Activity = `Chuyển trạng thái bệnh nhân <b>${await patient.P_FullName}</b>`;
                    obj.ActivityDetail = table[i].StatusChange[j];
                    activity.push(obj);
                }
            }
        }
    }

    return activity;
}

async function locationHistory(table, id) {

    let activity = [];
    if(!table){
        return activity;
    }

    for (let i in table){
        if (table[i].Manager_ID){
            for (let j in table[i].Manager_ID){
                if (table[i].Manager_ID[j] == id){
                    const patient = await PatientM.one('P_ID', table[i].P_ID);
                    const treatment = await Treatment.getTreatmentById(table[i].HospitalLocation[j]);
                    const obj = {};
                    obj.TimeLog = table[i].Time[j];
                    obj.Activity = `Chuyển nơi điều trị bệnh nhân <b>${await patient.P_FullName}</b>`;
                    obj.ActivityDetail = `Chuyển bệnh nhân  <b>${await patient.P_FullName}</b> đến khu điều trị <b>${await treatment.name}</b>`;
                    activity.push(obj);
                }
            }
        }
    }

    return activity;

}

function sortByDate(activity){
    if (activity.length == 0) {
        return;
    }
    let max = 0;

    for (let i = 0; i < activity.length; i++) {
        max = i;
        for (let j = i; j < activity.length; j++){
            if (Date.parse(activity[j].TimeLog) > Date.parse(activity[max].TimeLog)){
                max = j;
            }
        }
        [activity[i], activity[max]] = [activity[max], activity[i]];
    }
    
}

module.exports = new AdminController();
