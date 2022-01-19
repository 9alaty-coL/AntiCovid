const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');

router.get('/:id/infor', UserController.information);

router.get('/:id/pwd', UserController.password);

router.post('/:id/pwd', UserController.changePassword);

router.get('/:id/mHistory', UserController.managedHistory);

router.get('/:id/mHistory/location', UserController.location);

router.get('/:id/mHistory/status', UserController.status);

router.get('/:id/accBal', UserController.accountBalance);

router.get('/:id/debt', UserController.deposit);

router.get('/:id/pHistory', UserController.paidHistory);

router.get('/:id/pHistory/more', UserController.more);

router.get('/:id/package', UserController.package);

router.get('/:id/package/more', UserController.morePackage);

router.get('/package/:p_id', UserController.packageDetail);

router.post('/package/:p_id', UserController.buy);

router.get('/product/:p_id', UserController.productDetail);

router.get('/:id/bHistory', UserController.buyHistory);

router.get('/:id/bHistory/paid', UserController.paid);

router.get('/:id/bHistory/notpaid', UserController.notPaid);

router.post('/pay/:billID', UserController.pay);

router.get('/result', UserController.paymentResult);

router.get('/:id', UserController.home);

module.exports = router;
