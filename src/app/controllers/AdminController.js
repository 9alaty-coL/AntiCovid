class AdminController {
    home(req, res, next) {
        res.render('admin/home', { css: ['sidebars'] });
    }
}

module.exports = new AdminController();
