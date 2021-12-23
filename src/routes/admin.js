const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController');

router.post('/create', AdminController.newAccount);

router.get('/create', AdminController.create);

router.get('/treatment', AdminController.treatment);

router.get('/treatment/create', AdminController.createTreatment);

router.get('/', AdminController.home);

module.exports = router;
