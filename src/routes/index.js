const { isLoggedIn } = require('../middleware/authen');
const { isAdmin, isManager, isPatient } = require('../middleware/detectRole');
const authenRoute = require('./authen');
const adminRoute = require('./admin');
const managerRoute = require('./manager');
const patientRoute = require('./patient');

function route(app) {
    app.use(isLoggedIn);

    app.use('/admin', isAdmin, adminRoute);

    app.use('/manager', isManager, managerRoute);

    app.use('/patient', isPatient, patientRoute);

    app.use('/', authenRoute);
}

module.exports = route;
