const express = require('express');
const router = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

router.get('/', ManagerController.home);

module.exports = router;
