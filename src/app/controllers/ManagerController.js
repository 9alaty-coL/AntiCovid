class ManagerController {
    ///>> Method → <GET> <<///

    // Get → /
    home(req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['ManagerPage'],
            js: ['ManagerPage'],
        });
    }

    // Get → /search?=:Key
    search (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    // Get → /sortby=:SortID
    sortBy (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    // Get → /search?=:Key/sortby=:SortID
    search_sortBy (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    // Get → /detail/UserID=:UserID
    detail (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    // Get → /addUser
    addUser (req, res, next) {
        res.render('manager/home', {
            layout: 'manager',
            css: ['AdminPage'],
            js: ['AdminPage'],
        });
    }

    ///>> Method → <POST> <<///

    ///>> Method → <PUT> <<///

    ///>> Method → <DELETE> <<///
}

module.exports = new ManagerController();
