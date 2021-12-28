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

router.get('/:id/packet', UserController.packet);

router.get('/:id/packet/:p_id', UserController.packetDetail);

router.get('/:id/bHistory', UserController.buyHistory);

router.get('/:id', UserController.home);

module.exports = router;
