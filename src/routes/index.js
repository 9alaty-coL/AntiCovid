const authenMiddleware = require('../middleware/authen');
const authenRoute = require('./authen');
const adminRoute = require('./admin');
const managerRoute = require('./manager');
const patientRoute = require('./patient');

function route(app) {
    app.use(authenMiddleware.isLoggedIn);

    app.use('/admin', adminRoute);

    app.use('/manager', managerRoute);

    app.use('/patient', patientRoute);

    app.use('/', authenRoute);
}

module.exports = route;
