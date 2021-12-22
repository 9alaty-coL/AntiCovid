const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/UserController');

router.get('/infor', UserController.information);

router.get('/pwd', UserController.password);

router.get('/mHistory', UserController.managedHistory);

router.get('/accBal', UserController.accountBalance);

router.get('/deposit', UserController.deposit);

router.get('/pHistory', UserController.paidHistory);

router.get('/', UserController.home);

module.exports = router;
