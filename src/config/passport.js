const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../app/models/User');

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.one('username', username);
        if (user == null) {
            return done(null, false, { message: 'No user with that username' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
            // if (password == user.password) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (_id, done) => {
        let us = await User.one('_id', _id);
        return done(null, us);
    });
}

module.exports = initialize;
