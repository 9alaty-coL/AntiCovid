const express = require('express');
const router = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

// >> GET

router.get('/', ManagerController.home);

router.get('/listUser', ManagerController.listUser);

router.get('/search', ManagerController.search);

router.get('/detail/UserID=:UserID', ManagerController.detail);

router.get('/addUser', ManagerController.addUser);

router.get('/addRelate/UserID=:UserID', ManagerController.addRelate);

router.get('/product', ManagerController.Product);

router.get('/productEdit', ManagerController.productEdit);

//put update product
router.put('/productEdit/:id/edit', ManagerController.productUpdate);

router.get('/product/:p_id', ManagerController.productDetail);

router.get('/productEdit/:p_id/edit', ManagerController.product_Edit);

router.delete('/:id', ManagerController.deleteProduct);

router.get('/package', ManagerController.Package);

router.get('/package/:p_id', ManagerController.packageDetail);

router.get('/chartStatusByTime', ManagerController.chartStatusByTime);

router.get('/chartStatusChange', ManagerController.chartStatusChange);

router.get('/changeMinPayment', ManagerController.changeMinPayment);

router.get('/sendPaymentNotification', ManagerController.sendPaymentNotification)

// >> POST
router.post('/addUser', ManagerController.postAddUser);

router.post('/addRelate/UserID=:UserID', ManagerController.postAddRelate);

// >> PUT
router.put('/detail/UserID=:UserID/changeStatus', ManagerController.changeStatus)

router.put('/detail/UserID=:UserID/changeLocation', ManagerController.changeLocation)

router.put('/putChangeMinPayment', ManagerController.putChangeMinPayment);

// >> GET FETCH
router.get('/username', ManagerController.fetchUserName)

router.get('/relate', ManagerController.fetchRelateGroup)

router.get('/treatmentplace', ManagerController.fetchTreatmentPlace)

// add prodcut
router.get('/productEdit/add',ManagerController.addProduct);

router.post('/productEdit/add', ManagerController.newProduct);

router.get('/province', ManagerController.fetchProvince)

router.get('/district', ManagerController.fetchDistrict)

router.get('/ward', ManagerController.fetchWard)

module.exports = router;
