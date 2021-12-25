const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/UserController');

router.get('/:id/infor', UserController.information);

router.get('/:id/pwd', UserController.password);

router.get('/:id/mHistory', UserController.managedHistory);

router.get('/:id/accBal', UserController.accountBalance);

router.get('/:id/deposit', UserController.deposit);

router.get('/:id/pHistory', UserController.paidHistory);

router.get('/:id', UserController.home);

module.exports = router;
