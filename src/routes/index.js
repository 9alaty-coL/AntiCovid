const authenRoute = require('./authen');

function route(app) {
    app.use('/', authenRoute);
}

module.exports = route;
