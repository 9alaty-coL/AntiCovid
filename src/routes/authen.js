const express = require('express');
const router = express.Router();

const AuthenController = require('../app/controllers/AuthenController');

router.get('/sign-in', AuthenController.signIn);

router.get('/', (req, res, next) => {
    return res.redirect('/sign-in');
});

module.exports = router;
