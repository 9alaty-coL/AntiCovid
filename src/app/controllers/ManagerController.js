class ManagerController {
    home(req, res, next) {
        res.render('manager/home');
    }
}

module.exports = new ManagerController();
