const UserM = require('../models/Authen')
const UserModel = require('../models/User')
const ManagerModel = require('../models/Manager')
const ProductsModel = require('../models/Product')
const PackagesModel = require('../models/Package')
const LocationHistoryModel = require('../models/LocationHistory')
const StatusHistoryModel = require('../models/StatusHistory')
const TreatmentPlacesModel = require('../models/TreatmentPlaces')
const TimeUtils = require('../../utils/Time')
const StringSupportUtils = require('../../utils/stringSupport');
const bcrypt = require('bcrypt');

const ProvinceModel = require('../models/AddressProvince')
const DistrictModel = require('../models/AddressDistrict')
const WardModel = require('../models/AddressWard')

const e = require('express')

function calStatus(Status, offset) {
    if (offset < 0) {
        if (Status === "F0") return "Khỏi bệnh"
        else return "Không"
    }
    else {
        let nextF = Math.max(0, parseInt(Status[1]) - offset);
        return Status[0] + nextF;
    }
}

let Products;
let Packages
class ManagerController {
    ///>> Method → <GET> <<///

    // Get → /
    async home(req, res, next) {
        Products = await ProductsModel.all();
        Packages = await PackagesModel.all();
        Packages.sort(function(a,b){
            return a.P_ID - b.P_ID;
        });

        res.render('manager/home', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['UserSearchBar','ManagerPage'],
        });
    }

    // Get → /userlist
    async listUser(req, res, next) {
        // Query info
        let page = req.query.page;
        if (page === undefined) page = 1;
        let sort = req.query.sort;
        if (sort === undefined) sort = "";
        let order = req.query.order;
        if (order === undefined) order = "";

        // Get list of user
        let users = [];
        if (sort === "") {
            users = await UserModel.all();
        } else {
            users = await UserModel.order(sort, order);
        }

        // Check page
        page = Math.min(Math.floor((users.length - 1) / 10) + 1, page);
        let maxPage = Math.floor((users.length - 1) / 10) + 1;
        let pages = [];
        for (let index = page - 2; pages.length < Math.min(maxPage,5) && index <= maxPage; index++) {
            if (index < 1) continue;
            if (index === page) pages.push({pageNumber: index, isCurrentPage: "on"});
            else pages.push({pageNumber: index, isCurrentPage: "off"});
        }
        let Previous = "on";
        if (page === pages[0].pageNumber) Previous = "off";
        let Next = "on";
        if (page === pages[pages.length - 1].pageNumber) Next = "off";

        // Cut off users for selected page
        users = users.slice((page - 1) * 10, Math.min((page - 1) * 10 + 10), users.length);

        // Handle ID HospitalLocation
        for (let i = 0; i < users.length; i++) {
            users[i].P_TreatmentPlace = (await TreatmentPlacesModel.one('_id', users[i].P_TreatmentPlace)).name;
        }

        // Render
        res.render('manager/listUser', {
            layout: 'manager',
            users: users,
            currentPageNumber: page,
            Previous: Previous,
            Next: Next,
            pages: pages,
            sort: sort,
            order: order,
            css: ['ManagerPage'],
            js: ['UserListPage','UserSearchBar','ManagerPage'],
        });
    }

    // Get → /search
    async search(req, res, next) {
        // Key
        let key = {};

        for (let eachKey in req.query) {
            if (req.query[eachKey] !== "") {
                key[eachKey] = req.query[eachKey];
            }
        }

        // Search for user
        let users = await UserModel.search(key);
        if (users !== null) {
            for (let i = 0; i < users.length; i++) {
                users[i].P_TreatmentPlace = (await TreatmentPlacesModel.one('_id', users[i].P_TreatmentPlace)).name;
            }
        } else {
            users = []
        }

        // Render
        res.render('manager/searchUser', {
            key: key,
            users: users,
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['OnFocusReset','AddressControlSearch','SearchUser','UserSearchBar','ManagerPage'],
        });
    }

    // Get → /detail/UserID=:UserID
    async detail(req, res, next) {
        // User Info
        let userID = req.params.UserID;
        let userInfo = await UserModel.one('P_ID', userID);
        userInfo.P_TreatmentPlace = (await TreatmentPlacesModel.one('_id', userInfo.P_TreatmentPlace)).name;

        // User Location History
        let resLocationHistory = await LocationHistoryModel.one('P_ID', userID);
        let userlogLocation = [];
        for (let i = 0; resLocationHistory !== null && i < resLocationHistory.Time.length; i++) {
            let Manager = await ManagerModel.one('M_ID', resLocationHistory.Manager_ID[i]);
            let Location = await TreatmentPlacesModel.one('_id', resLocationHistory.HospitalLocation[i]);
            userlogLocation.push({ Time: resLocationHistory.Time[i], Activity: Location.name, Manager: Manager.ManagerName });
        }

        // User Status History
        let resStatusHistory = await StatusHistoryModel.one('P_ID', userID);
        let userlogStatus = [];
        for (let i = 0; resStatusHistory !== null && i < resStatusHistory.Time.length; i++) {
            let Manager = await ManagerModel.one('M_ID', resStatusHistory.Manager_ID[i]);
            userlogStatus.push({ Time: resStatusHistory.Time[i], Activity: resStatusHistory.StatusChange[i], Manager: Manager.ManagerName });
        }

        // User RelateInfo
        let relateInfo = await UserModel.relate(userInfo.P_RelateGroup, userInfo.P_ID);
        for (let i = 0; i < relateInfo.length; i++) {
            relateInfo[i].P_TreatmentPlace = (await TreatmentPlacesModel.one('_id', relateInfo[i].P_TreatmentPlace)).name;
        }

        res.render('manager/detailUser', {
            user: userInfo,
            userlogLocation: userlogLocation,
            userlogStatus: userlogStatus,
            relates: relateInfo,
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['DetailRelate','UserSearchBar','DetailUser','AddUser', 'ManagerPage'],
        });
    }

    // Get → /addUser
    addUser(req, res, next) {
        res.render('manager/addUser', {
            layout: 'manager',
            AccountError: '',
            UserError: '',
            AccountData: {username: ''},
            UserData: {P_FullName: '', P_IdentityCard: '', P_YearOfBirth: '', P_Status: '', P_Address: '', P_HospitalAddress: '', P_RelateGroup: ''},
            HospitalData: {hospitalData: '', IDHospital: 0},
            RelateData: {relateData: '', IDGroup: 0, Lock: 'off'},
            css: ['ManagerPage'],
            js: ['OnFocusReset','AddressControl','DetailUser','UserSearchBar','AddUser','ManagerPage'],
        });
    }

    // Get → /addRelate/UserID=:UserID
    async addRelate(req, res, next) {
        let user = await UserModel.one('P_ID', req.params.UserID);
        let RelateData = {relateData: user.P_FullName + " - Status: " + user.P_Status + " - ID: " + user.P_IdentityCard, IDGroup: user.P_RelateGroup, Lock: 'on'}

        res.render('manager/addUser', {
            layout: 'manager',
            AccountError: '',
            UserError: '',
            AccountData: {username: ''},
            UserData: {P_FullName: '', P_IdentityCard: '', P_YearOfBirth: '', P_Status: '', P_Address: '', P_HospitalAddress: '', P_RelateGroup: ''},
            HospitalData: {hospitalData: '', IDHospital: 0},
            RelateData: RelateData,
            css: ['ManagerPage'],
            js: ['OnFocusReset','AddressControl','DetailUser','UserSearchBar','AddUser','ManagerPage'],
        });
    }

    // Get → /chartStatusByTime
    async chartStatusByTime(req, res, next) {    
        // Last 6 months ago
        let month = (new Date()).getMonth() + 1;
        let year = (new Date()).getFullYear();     
        let labels = [];
        let times = [];
        for (let i = 0; i < 6; i++) {
            labels.push({TimeLabels: "Tháng " + month + " Năm " + year});
            times.push({month: month, year: year});
            if (month === 1) { month = 12; year--; }
            else month--;
        }
        labels.reverse();

        // Getting Database from User StatusHistory
        let usersStatusHistory = await StatusHistoryModel.all();
        let Status = {
            F0: [0,0,0,0,0,0],
            F1: [0,0,0,0,0,0],
            F2: [0,0,0,0,0,0],
            F3: [0,0,0,0,0,0],
            KhoiBenh: [0,0,0,0,0,0]
        }

        for (let i = 0; i < usersStatusHistory.length; i++) {
            console.log("ID=" + usersStatusHistory[i].P_ID + " with TimeLength=" + usersStatusHistory[i].Time.length);
            for (let j = 0; j < usersStatusHistory[i].Time.length; j++) {
                // From
                let from = new Date(usersStatusHistory[i].Time[j]);
                // To
                let to;
                if (j === usersStatusHistory[i].Time.length - 1) to = new Date();
                else to = new Date(usersStatusHistory[i].Time[j + 1]);

                for (let k = 0; k < times.length; k++) {
                    let newTime = TimeUtils.createDate(times[k].month - 1, times[k].year)
                    if (TimeUtils.isMonthBetween(from, to, newTime)) {
                        let StatusSlice = usersStatusHistory[i].StatusChange[j].split(' → ')[1];

                        if (StatusSlice === "F0") Status.F0[5-k]++;
                        else if (StatusSlice === "F1") Status.F1[5-k]++;
                        else if (StatusSlice === "F2") Status.F2[5-k]++;
                        else if (StatusSlice === "F3") Status.F3[5-k]++;
                        else if (StringSupportUtils.nonAccentVietnamese(StatusSlice) === StringSupportUtils.nonAccentVietnamese("Khỏi bệnh")) Status.KhoiBenh[5-k]++;
                    }
                }
            }
        }
        
        // Render
        res.render('manager/chartStatusByTime', {
            labels: labels,
            status: Status,
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['UserSearchBar','ManagerPage'],
        });
    }

    Product(req, res, next) {
        
        res.render('manager/product', {
            layout: 'manager_P',
            Products: Products,
            css: ['ManagerPage'],
            js: ['SearchProductsPackages', 'ManagerPage'],
            listOfPackages: Packages,
            listOfProducts: Products,
        });
    }

    Package(req, res, next) {

        res.render('manager/package', {
            layout: 'manager_P',
            css: ['ManagerPage'],
            js: ['SearchProductsPackages', 'ManagerPage'],
            listOfPackages: Packages,
            listOfProducts: Products,
        });
    }

    packageDetail(req, res, next) {
        const packageID = req.params.p_id;
        let currPackage = Packages.filter(pack => pack.P_ID == packageID)[0];
        let productsInPackage = [];
        for (let i = 0; i < currPackage.P_ProductsID.length; i++) {
            productsInPackage[i] = Products.filter(product => product.Product_ID == currPackage.P_ProductsID[i])[0];
            productsInPackage[i].Product_Limit = currPackage.Product_Limit[i];
        }

        res.render('manager/packageDetail', {
            layout: 'manager_P',
            css: ['ManagerPage'],
            js: ['SearchProductsPackages', 'ManagerPage'],
            currPackage: currPackage,
            productsInPackage: productsInPackage,
            listOfPackages: Packages,
            listOfProducts: Products,
        });
        return;
    }

    productDetail(req, res, next) {
        const productID = req.params.p_id;
        let currProduct = Products.filter(product => product.Product_ID == productID)[0];;

        res.render('manager/productDetail', {
            layout: 'manager_P',
            css: ['ManagerPage'],
            js: ['SearchProductsPackages', 'ManagerPage'],
            currProduct: currProduct,
            listOfPackages: Packages,
            listOfProducts: Products,
        });
        return;
    }

    ///>> Method → <POST> <<///
    async postAddUser(req, res, next) {
        // Post by:
        let manager = req.user;

        // Form input
        let AccountData = {username: req.body.username, role: 'user', isLocked: false};
        let UserData = {P_FullName: req.body.P_FullName, 
                        P_IdentityCard: req.body.P_IdentityCard, 
                        P_YearOfBirth: req.body.P_YearOfBirth, 
                        P_Status: req.body.P_Status, 
                        P_Address: (await ProvinceModel.one(req.body.Province)).ProvinceName  + ", " 
                                 + (await DistrictModel.one(req.body.Province, req.body.District)).DistrictName + ", " + req.body.Ward + ", " + req.body.P_Address,
                        P_TreatmentPlace: parseInt(req.body.P_HospitalAddress), 
                        P_RelateGroup: req.body.P_RelateGroup};
        let HospitalData = {hospitalData: req.body.location, IDHospital: req.body.P_HospitalAddress};
        let RelateData = {relateData: req.body.relate, IDGroup: req.body.P_RelateGroup};

        // Account data
        let existAccount = await UserM.getUserByUN(req.body.username);
        if (existAccount) {
            return res.render('manager/addUser', {
                layout: 'manager',
                AccountError: 'username đã tồn tại',
                UserError: '',
                AccountData: AccountData,
                UserData: UserData,
                HospitalData: HospitalData,
                RelateData: RelateData,
                css: ['ManagerPage'],
                js: ['AddUser','DetailUser','UserSearchBar','ManagerPage'],
            });
        }

        // User data
        let existUser = await UserModel.one('P_IdentityCard', req.body.P_IdentityCard);
        if (existUser) {
            return res.render('manager/addUser', {
                layout: 'manager',
                AccountError: '',
                UserError: 'Identity Card đã tồn tại',
                AccountData: AccountData,
                UserData: UserData,
                HospitalData: HospitalData,
                RelateData: RelateData,
                css: ['ManagerPage'],
                js: ['AddUser','DetailUser','UserSearchBar','ManagerPage'],
            });
        }

        //->> if data if valid

        // Create new user account
        AccountData.password = await bcrypt.hash(req.body.password, 10);
        AccountData._id = await UserM.nextID();
        await UserM.insert(AccountData);

        // Create new user 
        UserData.P_ID = AccountData._id;
        if (parseInt(UserData.P_RelateGroup) === 0) {
            UserData.P_RelateGroup = parseInt(await UserModel.maxGroupID()) + 1;
        }
        await UserModel.insert(UserData);

        // Create new user LocationHistory
        let LocationHistoryData = {P_ID: AccountData._id, Time: [`${TimeUtils.getNow()}`], HospitalLocation: [UserData.P_TreatmentPlace] , Manager_ID: [manager._id]}
        await LocationHistoryModel.insert(LocationHistoryData);

        // Create new user StatusHistory
        let StatusHistoryData = {P_ID: AccountData._id, Time: [`${TimeUtils.getNow()}`], StatusChange: [`Không → ${UserData.P_Status}`] , Manager_ID: [manager._id]}
        await StatusHistoryModel.insert(StatusHistoryData);

        // Redirect to User detail
        res.redirect(`/manager/detail/UserID=${AccountData._id}`);
    }

    async postAddRelate(req, res, next) {
        let user = await UserModel.one('P_ID', req.params.UserID);

        // Form data
        let addOption = req.body.addOption;
        let relate = (req.body.relate).split(" ");
        let P_RelateGroup = req.body.P_RelateGroup;

        // Add relate
        if (addOption === "one") {
            let newRelate = await UserModel.one('P_IdentityCard', relate[relate.length - 1]);
            let newRelateInfo = { P_ID: newRelate.P_ID, P_RelateGroup: user.P_RelateGroup };
            await UserModel.updateUser(newRelateInfo);
        } 
        else {
            let newRelate = await UserModel.relate(P_RelateGroup);
            for (let i = 0; i < newRelate.length; i++) {
                let newRelateInfo = { P_ID: newRelate[i].P_ID, P_RelateGroup: user.P_RelateGroup };
                await UserModel.updateUser(newRelateInfo);
            }
        }

        res.redirect(`/manager/detail/UserID=${user.P_ID}`);
    }

    ///>> Method → <PUT> <<///
    async changeStatus(req, res, next) {
        // Change Status by:
        let manager = req.user;

        // Offset:
        let from = req.body.from;
        let to = req.body.to;
        let offset = parseInt(from[1]) - parseInt(to[1]);  

        // User Info:
        let user = await UserModel.one('P_ID', req.params.UserID);

        // Relate Info
        let relate = await UserModel.relate(user.P_RelateGroup, user.P_ID);

        if (!(user.P_Status === "F0" && relate.some(r => r.P_Status === "F0"))) {
            // Change Relate Status + Report StatusHistory
            for (let i = 0; i < relate.length; i++) {
                if (relate[i].P_Status === "Khỏi bệnh" || relate[i].P_Status === "F0") continue;
                // Change Relate Status
                if (relate[i].P_Status === "Không") relate[i].P_Status = "F4";
                let newRelateStatus = { P_ID: relate[i].P_ID, P_Status: calStatus(relate[i].P_Status, offset) };
                if (relate[i].P_Status === "Không" && newRelateStatus.P_Status === "Không") continue;
                await UserModel.updateUser(newRelateStatus);
                // Report StatusHistory
                let reportRelateStatus = { Time: TimeUtils.getNow(), StatusChange: relate[i].P_Status + " → " + calStatus(relate[i].P_Status, offset), Manager_ID: manager._id }
                await StatusHistoryModel.append(relate[i].P_ID, reportRelateStatus);
            }    
        }

        // Change User Status
        let newUserStatus = { P_ID: user.P_ID, P_Status: calStatus(user.P_Status, offset) };
        await UserModel.updateUser(newUserStatus);
        // Report StatusHistory
        let reportUserStatus = { Time: TimeUtils.getNow(), StatusChange: user.P_Status + " → " + calStatus(user.P_Status, offset), Manager_ID: manager._id }
        await StatusHistoryModel.append(user.P_ID, reportUserStatus);

        // Redirect
        return res.redirect(`/manager/detail/UserID=${req.params.UserID}`);
    }

    async changeLocation(req, res, next) {
        // Change Location by:
        let manager = req.user;

        // User Info:
        let user = await UserModel.one('P_ID', req.params.UserID);        

        // Update User Location + Report LocationHistory
        let newUserStatus = { P_ID: user.P_ID, P_TreatmentPlace: req.body.location_id };
        await UserModel.updateUser(newUserStatus);
        
        let reportLocation = { Time: TimeUtils.getNow(), HospitalLocation: req.body.location_id, Manager_ID: manager._id }
        await LocationHistoryModel.append(user.P_ID, reportLocation);        

        // Redirect
        return res.redirect(`/manager/detail/UserID=${req.params.UserID}`);
    }

    ///>> Method → <GET> + FETCH <<///
    async fetchTreatmentPlace(req, res, next) {
        const TreatmentPlaces = await TreatmentPlacesModel.all();
        res.send(TreatmentPlaces);
    }

    async fetchUserName(req, res, next) {
        const User = await UserModel.all();
        let UserName = User.map(each => each.P_FullName);
        res.send(UserName);
    }

    async fetchRelateGroup(req, res, next) {
        const User = await UserModel.all();
        
        let Relate = [];
        for (let i = 0; i < User.length; i++) {
            Relate.push({P_FullName: User[i].P_FullName, P_Status: User[i].P_Status, P_IdentityCard: User[i].P_IdentityCard , P_RelateGroup: User[i].P_RelateGroup} )
        }
        res.send(Relate);
    }

    async fetchProvince(req, res, next) {
        const Province = await ProvinceModel.all();
        
        res.send(Province);
    }

    async fetchDistrict(req, res, next) {
        const District = await DistrictModel.all();
        
        res.send(District);
    }

    async fetchWard(req, res, next) {
        const Ward = await WardModel.all();
        
        res.send(Ward);
    }

}

module.exports = new ManagerController();
