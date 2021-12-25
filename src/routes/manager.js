const express = require('express');
const router = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

router.get('/', ManagerController.home);

router.get('/search?=:Key', ManagerController.search);

router.get('/sortby=:SortID', ManagerController.sortBy);

//router.get('/search?=:Key/sortby=:SortID', ManagerController.search_sortBy);

router.get('/detail/UserID=:UserID', ManagerController.detail);

router.get('/addUser', ManagerController.addUser);

module.exports = router;
