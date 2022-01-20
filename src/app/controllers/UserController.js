const alert = require('alert');
const Users = require('../models/User');
const Authens = require('../models/Authen');
const Bills = require('../models/Bill');
const LocationHistory = require('../models/LocationHistory');
const StatusHistory = require('../models/StatusHistory');
const TreatmentPlaces = require('../models/TreatmentPlaces');
const Packages = require('../models/Package');
const Products = require('../models/Product');
const bcrypt = require('bcrypt');
const jwt = require('../../helpers/jwt.helper')

var currDate = new Date();

let id;
let acc;
let user;
let relatedPeople = [];
let treatmentPlace;
let listOfPlaces;
let listOfBills;
let paidBills;
let notPaidBills;
let status = [];
let location = [];
let listOfPackages;
let listOfProducts;
let currPackage = { P_ID: -1};


let currPage1;
let currPage2;
let msg1;
let msg2;
let n1;
let n2;

const saltRounds = 10;
class UserController {
    async home(req, res, next) {
        id = req.params.id;

        acc = await Authens.one('_id', id);

        user = await Users.one('P_ID', id);

        relatedPeople = await Users.relate(user.P_RelateGroup, user.P_ID)
        
        listOfPlaces = await TreatmentPlaces.all();
        listOfPlaces.sort(function(a,b){
            return a._id - b._id;
        });

        treatmentPlace = listOfPlaces.filter(p => p._id === user.P_TreatmentPlace)

        listOfBills = await Bills.getBillsByUserID(id) 
        for(let i = 0; i < listOfBills.length; i++) {
            let tokens = listOfBills[i].B_Datetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            listOfBills[i].B_Date = date;
            listOfBills[i].B_Time = time;
        }
        listOfBills.sort(function(a,b){
            return new Date(b.B_Datetime) - new Date(a.B_Datetime);
        });

        paidBills = listOfBills.filter(bill => bill.B_IsPaid == true)      
        notPaidBills = listOfBills.filter(bill => bill.B_IsPaid == false)
        

        const statusHistory = await StatusHistory.one('P_ID', id)
        for (let i = 0; i < statusHistory.StatusChange.length; i++) {
            status[i] = {
                StatusChange : statusHistory.StatusChange[i],
                Time : statusHistory.Time[i],
            }
        }
        status.sort(function(a,b){
            return new Date(b.Time) - new Date(a.Time);
        });


        const locationHistory = await LocationHistory.one('P_ID', id);
        for (let i = 0; i < locationHistory.HospitalLocation.length; i++) {
            location[i] = {
                HospitalLocation : locationHistory.HospitalLocation[i],
                Time : locationHistory.Time[i],
                HospitalName: listOfPlaces.filter(p => p._id === locationHistory.HospitalLocation[i])[0],
            }
        }


        listOfPackages = await Packages.all();
        listOfPackages.sort(function(a,b){
            return a.P_ID - b.P_ID;
        });


        listOfProducts = await Products.all();
        listOfProducts.sort(function(a,b){
            return a.Product_ID - b.Product_ID;
        });

        let payment = 0;
        let debt = parseInt(user.P_Debt);
        let paid = parseInt(user.P_Paid);
        let minPayment = parseInt(user.P_MinPayment);
        if ( debt > minPayment && minPayment > paid) {
            payment = parseInt(user.P_MinPayment) - parseInt(user.P_Paid);
            alert(`Bạn cần thanh toán ${payment}đ để đạt hạn múc thanh toán tối thiểu kỳ này`);
        }
        
        res.redirect(`/user/${id}/infor`);
        return;
    }

    // GET /user/:id/infor
    information(req, res, next) { 

        res.render('user/information', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'information'],
            account: acc,
            user: user,
            relatedPeople: relatedPeople,
            notPaidBillsList: notPaidBills,
            treatmentPlace: treatmentPlace[0],
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
        });
        return;
    }

    // GET /user/:id/pwd
    password(req, res, next) {
        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: {P_ID:req.user._id},
            color: '',
            message: '',
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
        });
        return;
    }

    // Post /user/:id/pwd
    async changePassword(req, res, next) {
        let message ;
        let color;
        acc = await Authens.one('_id', req.user._id);
        const password = req.body.currpwd;
        const newPassword = req.body.newpwd;
        const confirm = req.body.confirm;
        const pwdHashed = await bcrypt.hash(newPassword, saltRounds);
        const challengeResult = await bcrypt.compare(password, acc.password)
        
        
        if(password ==='' || newPassword ==='' || confirm === '') {
            message = 'Vui lòng điền đầy đủ tất cả thông tin';
            color = 'red';
        }
        else if (!challengeResult) {
            message = 'Mật khẩu hiện tại bạn nhập không đúng';
            color = 'red';

        }
        else if(newPassword !== confirm) {
            message = 'Xác nhận nhận mật khẩu mới không trùng khớp';
            color = 'red';
        }
        else {
            let user = {
                _id: req.user._id,
                password: pwdHashed,
            }

            const _res = await Authens.update(user);
            // console.log(res)
            message = 'Đổi mật khẩu thành công';
            color = 'green';
            acc = await Authens.one('_id', req.user._id);
            if(password == '0'){
                return res.redirect('/')
            }
        }


        

        res.render('user/password', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'password'],
            user: user,
            color: color,
            message: message,
        });
        return;
        
    }

    // GET /user/:id/mHistory
    managedHistory(req, res, next) {
        currPage1 = 1;
        currPage2 = 1;
        msg1 = '';
        msg2 = '';
        n1 = currPage1 * 8;
        n2 = currPage2 * 8;
        if(n1 >= status.length) {
            n1 = status.length;
            msg1 = 'disabled';
        }
        if(n2 >= location.length) {
            n2 = location.length;
            msg2 = 'disabled';
        }
        let sta = status.slice(0, n1);
        let locate = location.slice(0, n2);

        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory'],
            user: user,
            notPaidBillsList: notPaidBills,
            status: sta,
            location: locate,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    location(req, res, next) {
        currPage2++ ;
        msg2 = '';
        n2 = currPage2 * 8;
        if(n2 >= location.length) {
            n2 = location.length;
            msg2 = 'disabled';
        }
        let sta = status.slice(0, n1);
        let locate = location.slice(0, n2);

        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory', 'location'],
            user: user,
            notPaidBillsList: notPaidBills,
            status: sta,
            location: locate,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    status(req, res, next) {
        currPage1++ ;
        msg1 = '';
        n1 = currPage1 * 8;
        if(n1 >= location.length) {
            n1 = location.length;
            msg1 = 'disabled';
        }
        let sta = status.slice(0, n1);
        let locate = location.slice(0, n2);

        res.render('user/managedHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'managedHistory', 'status'],
            user: user,
            notPaidBillsList: notPaidBills,
            status: sta,
            location: locate,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    // GET /user/:id/accBal
    accountBalance(req, res, next) {
        let payment = 0;
        let debt = parseInt(user.P_Debt);
        let paid = parseInt(user.P_Paid);
        let minPayment = parseInt(user.P_MinPayment);
        if ( debt > minPayment && minPayment > paid) {
            payment = parseInt(user.P_MinPayment) - parseInt(user.P_Paid);
        }
        
        res.render('user/accountBalance', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'accountBalance'],
            user: user,
            minPaid: payment,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
        });
        return;
    }

    // GET /user/:id/deposit
    async deposit(req, res, next) {
        res.render('user/deposit', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'deposit'],
            user: user,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
        });
        return;
    }

    // GET /user/:id/pHistory
    paidHistory(req, res, next) {
        currPage1 = 1;
        msg1 = '';
        n1 = currPage1 * 6;
        if(n1 >= paidBills.length) {
            n1 = paidBills.length;
            msg1 = 'disabled';
        }
        let paid = paidBills.slice(0, n1);


        for(let i = 0; i < paidBills.length; i++) {
            let tokens = paidBills[i].B_PaymentDatetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            paidBills[i].B_PaymentDate = date;
            paidBills[i].B_PaymentTime = time;
        }

        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory'],
            user: user,
            paidBills: paid,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
        });
        return;
    }

    more(req, res, next) {
        currPage1++;
        msg1 = '';
        n1 = currPage1 * 6;
        if(n1 >= paidBills.length) {
            n1 = paidBills.length;
            msg1 = 'disabled';
        }
        let paid = paidBills.slice(0, n2);

        for(let i = 0; i < paidBills.length; i++) {
            let tokens = paidBills[i].B_PaymentDatetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            paidBills[i].B_PaymentDate = date;
            paidBills[i].B_PaymentTime = time;
        }

        res.render('user/paidHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'paidHistory','morePaid'],
            user: user,
            paidBills: paid,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
        });
        return;
    }

    // GET /user/:id/package
    package(req, res, next) {
        // currPage1 = 1;
        // msg1 = '';
        // n1 = currPage1 * 6;
        // if(n1 >= listOfPackages.length) {
        //     n1 = listOfPackages.length;
        //     msg1 = 'disabled';
        // }
        // let packages = listOfPackages.slice(0, n1);
        let packages = listOfPackages;

        res.render('user/package', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'package'],
            user: user,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: packages,
            listOfProducts: listOfProducts,
            // message1: msg1,
        });
        return;
    }

    morePackage(req, res, next) {
        currPage1++;
        msg1 = '';
        n1 = currPage1 * 6;
        if(n1 >= listOfPackages.length) {
            n1 = listOfPackages.length;
            msg1 = 'disabled';
        }
        let packages = listOfPackages.slice(0, n2);

        res.render('user/package', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'package', 'morePaid'],
            user: user,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: packages,
            listOfProducts: listOfProducts,
            message1: msg1,
        });
        return;
    }

    // GET /user/package/:p_id
    packageDetail(req, res, next) {
        const packageID = req.params.p_id;
        currPackage = listOfPackages.filter(pack => pack.P_ID == packageID)[0];
        let productsInPackage = [];
        let productsImg = [];
        for (let i = 0; i < currPackage.P_ProductsID.length; i++) {
            productsInPackage[i] = listOfProducts.filter(product => product.Product_ID == currPackage.P_ProductsID[i])[0];
            productsInPackage[i].Product_Limit = currPackage.Product_Limit[i];
            productsInPackage[i].Main_Image = productsInPackage[i].Product_Image[0];
        }

        res.render('user/packageDetail', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'detail'],
            user: user,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            productsInPackage: productsInPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            mainImage: currPackage.P_Image[0],
        });
        return;
    }

    // Post /user/package/:p_id
    async buy(req, res, next) {
        var currDate = new Date();
        const packageID = req.params.p_id;
        const totalPrice = parseInt(req.body.totalPrice);
        let quantity = req.body.input;
        let randomID;
        let bill;
        let temp = [];

        for (let i = 0; i <quantity.length; i++) {
            quantity[i] = parseInt(quantity[i]);
        }

        let currPack =  listOfPackages.filter(pack => pack.P_ID == packageID)[0];
        for (let i = 0; i < currPack.P_ProductsID.length; i++) {
            let p = listOfProducts.filter(product => product.Product_ID === currPack.P_ProductsID[i])[0];
            temp.push(`${p.Product_Name} x ${quantity[i]} ${p.Product_Unit}`);
        }

        // Add new bill to Bills table
        do {
            randomID = Math.round(Math.random() * 100000);
            bill = {
                B_ID : `NYP${id}VN${randomID}`,
                B_UserID : id,
                B_Totalpayment: totalPrice,
                B_IsPaid: false,
                B_PaymentDatetime: null,
                B_Datetime: currDate.toString(), 
                B_Products : temp,
                B_PackageID: packageID,
                B_Quantity: quantity
            }
            
        } while(bill.B_ID === await Bills.one('B_ID', bill.B_ID ) )
        
        const result = await Bills.insert(bill);
        // Load all bills again
        listOfBills = await Bills.getBillsByUserID(id) 
        for(let i = 0; i < listOfBills.length; i++) {
            let tokens = listOfBills[i].B_Datetime.split(' ');
            let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
            let time = tokens[4];
            listOfBills[i].B_Date = date;
            listOfBills[i].B_Time = time;
        }
        listOfBills.sort(function(a,b){
            return new Date(b.B_Datetime) - new Date(a.B_Datetime);
        });
        paidBills = listOfBills.filter(bill => bill.B_IsPaid == true)
        notPaidBills = listOfBills.filter(bill => bill.B_IsPaid == false)

        // Increase dept
        let debt = parseInt(user.P_Debt) + totalPrice;
        let u = {
            P_ID: id,
            P_Debt: debt,
        }
        const result4 = await Users.updateUser(u);
        user = await Users.one('P_ID', id);


        // Update package sold quantity
        let packageSoldQuantity = currPack.P_SoldQuantity + 1;
        let updatedPackage = { 
            P_ID: packageID,
            P_SoldQuantity: packageSoldQuantity,
        }

        const result2 = await Packages.update(updatedPackage);

         // ReLoad all bills
        listOfPackages = await Packages.all();
        listOfPackages.sort(function(a,b){
            return a.P_ID - b.P_ID;
        });


        // Update products sold quantity
        let soldQuantity = [];
        let productsId =[];
        for (let i = 0; i < currPack.P_ProductsID.length; i++) {
            let temp = listOfProducts.filter(product => product.Product_ID == currPackage.P_ProductsID[i])[0];
            productsId[i] = temp.Product_ID;
            soldQuantity[i] = temp.Product_SoldQuantity + (quantity[i]);
        }

        for (let i = 0; i < productsId.length; i++) {
            let updatedProduct = { 
                Product_ID: productsId[i],
                Product_SoldQuantity: soldQuantity[i],
            }
            let result3 = await Products.update(updatedProduct);
        }
        listOfProducts = await Products.all();
        listOfProducts.sort(function(a,b){
            return a.Product_ID - b.Product_ID;
        });



        res.redirect(`/user/${id}/bHistory`);
        return;
    }


     // GET /user/product/:p_id
    productDetail(req, res, next) {
        const productID = req.params.p_id;
        let currProduct = listOfProducts.filter(product => product.Product_ID == productID)[0];;

        res.render('user/productDetail', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'productDetail'],
            user: user,
            notPaidBillsList: notPaidBills,
            currProduct: currProduct,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            mainImage: currProduct.Product_Image[0],
        });
        return;
    }

     // GET /user/:p_id/bHistory
    buyHistory(req, res, next) {
        currPage1 = 1;
        currPage2 = 1;
        msg1 = '';
        msg2 = '';
        n1 = currPage1 * 6;
        n2 = currPage2 * 6;
        if(n1 >= notPaidBills.length) {
            n1 = notPaidBills.length;
            msg1 = 'disabled';
        }
        if(n2 >= paidBills.length) {
            n2 = paidBills.length;
            msg2 = 'disabled';
        }
        let notPaid = notPaidBills.slice(0, n1);
        let paid = paidBills.slice(0, n2);

        res.render('user/buyHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'buyHistory'],
            user: user,
            paidBills: paid,
            notPaidBills: notPaid,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    paid(req, res, next) {
        currPage1++;
        msg1 = '';
        n1 = currPage1 * 6;
        if(n1 >= notPaidBills.length) {
            n1 = notPaidBills.length;
            msg1 = 'disabled';
        }
        let notPaid = notPaidBills.slice(0, n1);
        let paid = paidBills.slice(0, n2);

        res.render('user/buyHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'buyHistory', 'moreNotPaid'],
            user: user,
            paidBills: paid,
            notPaidBills: notPaid,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    notPaid(req, res, next) {
        currPage2++;
        msg2 = '';
        n2 = currPage2 * 6;
        if(n2 >= paidBills.length) {
            n2 = paidBills.length;
            msg2 = 'disabled';
        }
        let notPaid = notPaidBills.slice(0, n1);
        let paid = paidBills.slice(0, n2);

        res.render('user/buyHistory', {
            layout: 'user',
            css: ['UserPage'],
            js: ['UserPage', 'buyHistory', 'morePaid'],
            user: user,
            paidBills: paid,
            notPaidBills: notPaid,
            notPaidBillsList: notPaidBills,
            currPackage: currPackage,
            listOfPackages: listOfPackages,
            listOfProducts: listOfProducts,
            message1: msg1,
            message2: msg2,
        });
        return;
    }

    //GET /user/pay/:billID
    async pay(req, res, next){
        let bill = await Bills.getBillById(req.params.billID)
        let newBill = {
            "code_bill": bill.B_ID,
            "total_money": bill.B_Totalpayment,
            "bill": bill.B_Products,
            "user": req.user.username,
        }

        const token = await jwt.generateToken(newBill, process.env.TOKEN_SECRET_KEY)
        
        res.redirect('https://vinabank.herokuapp.com/confirm?token=' + token)
    }

    async paymentResult(req, res, next) {

        let token = req.query.token ?? null

        let success = null, fail = null
        

        try {
            let decoded = await jwt.verifyToken(token, process.env.TOKEN_SECRET_KEY)
            if(decoded?.data?.result == 'success'){
                success = decoded.data
                let bill = await Bills.getBillById(success.billId)
                let newBill = {...bill}
                newBill.B_IsPaid = 'true';
                newBill.B_PaymentDatetime = currDate.toString()
                await Bills.update(newBill);

                let paid = parseInt(user.P_Paid) + parseInt(bill.B_Totalpayment);
                let u = {
                    P_ID: id,
                    P_Paid: paid,
                }
                const result4 = await Users.updateUser(u);
                user = await Users.one('P_ID', id);
            }
            else if (decoded?.data?.result == 'fail'){
                fail = decoded.data
            }
            else{
                return res.send('invalid token')
            }

            listOfBills = await Bills.getBillsByUserID(id) 
            for(let i = 0; i < listOfBills.length; i++) {
                let tokens = listOfBills[i].B_Datetime.split(' ');
                let date = tokens[0] + ', ' + tokens[1] + ' ' + tokens[2] + ' ' + tokens[3] ;
                let time = tokens[4];
                listOfBills[i].B_Date = date;
                listOfBills[i].B_Time = time;
            }
            listOfBills.sort(function(a,b){
                return new Date(b.B_Datetime) - new Date(a.B_Datetime);
            });
            paidBills = listOfBills.filter(bill => bill.B_IsPaid == true)      
            notPaidBills = listOfBills.filter(bill => bill.B_IsPaid == false)

            let payment = 0;
            let debt = parseInt(user.P_Debt);
            let paid = parseInt(user.P_Paid);
            let minPayment = parseInt(user.P_MinPayment);
            if ( debt > minPayment && minPayment > paid) {
                payment = parseInt(user.P_MinPayment) - parseInt(user.P_Paid);
                alert(`Bạn cần thanh toán ${payment}đ để đạt hạn múc thanh toán tối thiểu kỳ này`);
            }
            else {
                alert(`Bạn đã hoàn thành hạn múc thanh toán tối thiểu kỳ này`);
            }

            return res.render('user/payResult', { 
                layout: 'user',
                css: ['UserPage'],
                js: ['UserPage'],
                user:user,
                success:success,
                fail:fail,
            });

        } catch (error) {
            res.send(`<h4>${error}</h4>`)
        }
    }
}

module.exports = new UserController();
