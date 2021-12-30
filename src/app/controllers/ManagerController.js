const UserModel = require('../models/User')
const ProductsModel = require('../models/product')
const PackagesModel = require('../models/package')
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
        res.render('manager/home', {
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
        let userID = req.params.UserID;
        let userInfo = await UserModel.one('P_ID', userID);
        let relateInfo = await UserModel.relate(userInfo.P_RelatedPersonID);

        res.render('manager/detailUser', {
            user: userInfo,
            userlog: [],
            relates: relateInfo,
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /addUser
    addUser (req, res, next) {
        res.render('manager/home', {
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
