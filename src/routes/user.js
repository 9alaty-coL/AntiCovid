const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');

router.get('/:id/infor', UserController.information);

router.get('/:id/pwd', UserController.password);

router.post('/:id/pwd', UserController.changePassword);

router.get('/:id/mHistory', UserController.managedHistory);

router.get('/:id/accBal', UserController.accountBalance);

router.get('/:id/deposit', UserController.deposit);

router.get('/:id/pHistory', UserController.paidHistory);

router.get('/:id/package', UserController.package);

router.get('/:id/package/:p_id', UserController.packageDetail);

router.get('/:id/product/:p_id', UserController.productDetail);

router.get('/:id/bHistory', UserController.buyHistory);

router.get('/:id', UserController.home);

module.exports = router;
