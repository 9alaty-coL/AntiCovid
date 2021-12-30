const express = require('express');
const router = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

router.get('/', ManagerController.home);

router.get('/listUser', ManagerController.listUser);

router.get('/search', ManagerController.search);

router.get('/sortby=:SortID', ManagerController.sortBy);

//router.get('/search?=:Key/sortby=:SortID', ManagerController.search_sortBy);

router.get('/detail/UserID=:UserID', ManagerController.detail);

router.get('/addUser', ManagerController.addUser);

router.get('/product', ManagerController.Product);

router.get('/package', ManagerController.Package);

router.get('/addRelate/UserID=:UserID', ManagerController.addRelate);

module.exports = router;
