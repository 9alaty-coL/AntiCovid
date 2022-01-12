const express = require('express');
const router = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

// >> GET

router.get('/', ManagerController.home);

router.get('/listUser', ManagerController.listUser);

router.get('/search', ManagerController.search);

router.get('/detail/UserID=:UserID', ManagerController.detail);

router.get('/addUser', ManagerController.addUser);

router.get('/addRelate/UserID=:UserID', ManagerController.addRelate);

router.get('/product', ManagerController.Product);

router.get('/package', ManagerController.Package);

// >> POST
router.post('/addUser', ManagerController.postAddUser);

router.post('/addRelate/UserID=:UserID', ManagerController.postAddRelate);

// >> PUT
router.put('/detail/UserID=:UserID/changeStatus', ManagerController.changeStatus)

router.put('/detail/UserID=:UserID/changeLocation', ManagerController.changeLocation)

// >> GET FETCH
router.get('/username', ManagerController.fetchUserName)

router.get('/relate', ManagerController.fetchRelateGroup)

router.get('/treatmentplace', ManagerController.fetchTreatmentPlace)



module.exports = router;
