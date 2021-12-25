const { isLoggedIn } = require('../middleware/authen');
const { isAdmin, isManager, isUser } = require('../middleware/detectRole');
const authenRoute = require('./authen');
const adminRoute = require('./admin');
const managerRoute = require('./manager');
const userRoute = require('./user');

function route(app) {
    app.use(isLoggedIn);

    app.use('/admin', adminRoute);

    app.use('/manager', managerRoute);

    app.use('/user', userRoute);

    app.use('/', authenRoute);
}

module.exports = route;
