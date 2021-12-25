const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController');

router.post('/create', AdminController.newAccount);

router.get('/create', AdminController.create);

router.get('/treatment', AdminController.treatment);

router.get('/treatment/create', AdminController.createTreatment);

router.post('/treatment/create', AdminController.newTreatment);

router.delete('/:id', AdminController.deleteTreatment);

router.get('/treatment/:id/edit', AdminController.editTreatment);

router.put('/treatment/:id/edit', AdminController.updateTreatment);

router.get('/', AdminController.home);

module.exports = router;
