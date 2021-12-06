const authenRoute = require('./authen');
const authenMiddleware = require('../middleware/authen');

function route(app) {
    app.use(authenMiddleware.isLoggedIn);

    app.use('/', authenRoute);
}

module.exports = route;
