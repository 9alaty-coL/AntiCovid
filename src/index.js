const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const app = express();

// flash
app.use(flash());

// session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    }),
);

// passport
const initialize = require('./config/passport');
initialize(passport);
app.use(passport.initialize());
app.use(passport.session());

// port
const port = process.env.PORT || 3000;

// public file
app.use(express.static(path.join(__dirname, 'public')));

// express-handlebars
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        sum: function (a, b) {
            return a + b;
        },
    },
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Middleware: read body of post method
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

// router
const route = require('./routes');
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
