const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/UserController');

router.get('/', UserController.home);

module.exports = router;
