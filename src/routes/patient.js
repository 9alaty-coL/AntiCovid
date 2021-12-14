const express = require('express');
const router = express.Router();

const PatientController = require('../app/controllers/PatientController');

router.get('/', PatientController.home);

module.exports = router;
