const UserModel = require('../models/User')
const ManagerModel = require('../models/Manager')
const ProductsModel = require('../models/Product')
const PackagesModel = require('../models/Package')
const LocationHistoryModel = require('../models/LocationHistory')
const StatusHistoryModel = require('../models/StatusHistory')
const TreatmentPlacesModel = require('../models/TreatmentPlaces')
const TimeUtils = require('../../utils/Time')
const e = require('express')

function calStatus(Status, offset) {
    if (Status === "Không") Status = "F4";
    let nextStatus = parseInt(Status[1]) + offset;
    if (nextStatus < 0) return "F0";
    else if (nextStatus > 3) return "Không";
    else return "F" + nextStatus;
}

class ManagerController {
    ///>> Method → <GET> <<///

    // Get → /
    home(req, res, next) {      
        res.render('manager/home', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /userlist
    async listUser (req, res, next) {
        let users = await UserModel.all();

        res.render('manager/listUser', {
            layout: 'manager',
            users: users,
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /search?=:Key
    search (req, res, next) {
        res.render('manager/searchUser', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /sortby=:SortID
    sortBy (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /search?=:Key/sortby=:SortID
    search_sortBy (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /detail/UserID=:UserID
    async detail (req, res, next) {
        // User Info
        let userID = req.params.UserID;
        let userInfo = await UserModel.one('P_ID', userID);

        // User Location History
        let resLocationHistory = await LocationHistoryModel.one('P_ID',userID);
        let userlogLocation = [];
        for (let i = 0; i < resLocationHistory.Time.length; i++) {
            let Manager = await ManagerModel.one('M_ID', resLocationHistory.Manager_ID[i]);
            let Location = await TreatmentPlacesModel.one('_id', resLocationHistory.HospitalLocation[i]);
            userlogLocation.push({Time: resLocationHistory.Time[i], Activity: Location.name, Manager: Manager.ManagerName});
        }

        // User Status History
        let resStatusHistory = await StatusHistoryModel.one('P_ID',userID);
        let userlogStatus = [];
        for (let i = 0; i < resStatusHistory.Time.length; i++) {
            let Manager = await ManagerModel.one('M_ID', resStatusHistory.Manager_ID[i]);
            userlogStatus.push({Time: resStatusHistory.Time[i], Activity: resStatusHistory.StatusChange[i], Manager: Manager.ManagerName});
        }

        // User RelateInfo
        let relateInfo = await UserModel.relate(userInfo.P_RelatedPersonID);

        res.render('manager/detailUser', {
            user: userInfo,
            userlogLocation: userlogLocation,
            userlogStatus: userlogStatus,
            relates: relateInfo,
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['DetailUser','DetailRelate','ManagerPage'],
        });
    }

    // Get → /addUser
    addUser (req, res, next) {
        res.render('manager/addUser', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    addRelate (req, res, next) {
        res.render('manager/addRelate', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }
    

    product (req, res, next) {
        res.render('manager/product', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }
    async Product (req, res, next) {
        let Products = await ProductsModel.all();

        res.render('manager/product',{
            layout: 'manager',
            Products: Products,
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }
    async Package (req, res, next) {
        let Packages = await PackagesModel.all();

        res.render('manager/Package',{
            layout: 'manager',
            Packages: Packages,
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }
    

    ///>> Method → <POST> <<///


    ///>> Method → <PUT> <<///
    async changeStatus (req, res, next) {
        // Change Status by:
        let manager = req.user;

        // Offset:
        let from = req.body.from;
        let to = req.body.to;
        let offset = parseInt(to[1]) - parseInt(from[1]);

        // User Info:
        let user = await UserModel.one('P_ID', req.params.UserID);
        
        // Change Relate Status + Report StatusHistory
        for (let i = 0; i < user.P_RelatedPersonID.length; i++) {
            let relate = await UserModel.one('P_ID', user.P_RelatedPersonID[i]);
            if (relate.P_Status !== "Không" && parseInt(relate.P_Status[1]) < parseInt(user.P_Status[1])) continue;
            else {
                // Change Relate Status
                let newRelateStatus = { P_ID: relate.P_ID, P_Status: calStatus(relate.P_Status, offset) };
                await UserModel.updateUser(newRelateStatus);
                // Report StatusHistory
                let reportRelateStatus = { Time: TimeUtils.getNow(), StatusChange: relate.P_Status + " → " + calStatus(relate.P_Status, offset), Manager_ID: manager._id}
                await StatusHistoryModel.append(relate.P_ID, reportRelateStatus);
            }
        }

        // Change User Status
        let newUserStatus = { P_ID: user.P_ID, P_Status: calStatus(user.P_Status, offset) };
        await UserModel.updateUser(newUserStatus);
        // Report StatusHistory
        let reportUserStatus = { Time: TimeUtils.getNow(), StatusChange: user.P_Status + " → " + calStatus(user.P_Status, offset), Manager_ID: manager._id}
        await StatusHistoryModel.append(user.P_ID, reportUserStatus);

        // Redirect
        return res.redirect(`/manager/detail/UserID=${req.params.UserID}`);
    }

    ///>> Method → <DELETE> <<///
}

module.exports = new ManagerController();
