const UserModel = require('../models/User')

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
        // User Info
        let userID = req.params.UserID;
        let userInfo = await UserModel.one('P_ID', userID);

        // User Location History
        let resLocationHistory = await UserModel.userLocationHistory(userID);
        let userLocationHistory = [];
        for (let i = 0; i < resLocationHistory.Time.length; i++) {
            userLocationHistory.push({Time: resLocationHistory.Time[i], HospitalLocation: resLocationHistory.HospitalLocation[i]});
        }

        // User RelateInfo
        let relateInfo = await UserModel.relate(userInfo.P_RelatedPersonID);

        res.render('manager/detailUser', {
            user: userInfo,
            userLocationHistory: userLocationHistory,
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

    ///>> Method → <POST> <<///

    ///>> Method → <PUT> <<///

    ///>> Method → <DELETE> <<///
}

module.exports = new ManagerController();
