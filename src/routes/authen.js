const express = require('express');
const router = express.Router();

const AuthenController = require('../app/controllers/AuthenController');

router.get('/sign-in', AuthenController.signIn);

module.exports = router;
