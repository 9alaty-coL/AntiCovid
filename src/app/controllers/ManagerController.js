const UserModel = require('../models/User')
const ManagerModel = require('../models/Manager')
const ProductsModel = require('../models/product')
const PackagesModel = require('../models/package')
const LocationHistoryModel = require('../models/LocationHistory')
const StatusHistoryModel = require('../models/StatusHistory')

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
            userlogLocation.push({Time: resLocationHistory.Time[i], Activity: resLocationHistory.HospitalLocation[i], Manager: Manager.ManagerName});
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
            js: ['ManagerPage'],
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

    ///>> Method → <DELETE> <<///
}

module.exports = new ManagerController();
