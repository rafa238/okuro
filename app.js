const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const hbs = require("hbs");
const bodyparser = require('body-parser');
const passport = require("passport");

dotenv.config({ path: './.env' });
const app = express();
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

/* Flash */
app.use(flash());
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    next();
});

/*Public Files*/ 
const publicFiles = path.join(__dirname, '/public');
const materialFiles = path.join(__dirname, "/files/material");
const imageFiles = path.join(__dirname, "/files/profile");
app.use('/static', express.static(publicFiles));
app.use("/material", express.static(materialFiles));
app.use("/image", express.static(imageFiles));

/*Passport*/
const initializePassport = require('./controllers/passport')
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

/*HBS*/
hbs.registerPartials(__dirname + "/views/parciales");
hbs.registerHelper("ifPropio", (permiso, options) => {
    return (permiso == 1) ? options.fn(this) : options.inverse(this);
});
app.set('view engine', 'hbs');

/* Routes */
app.use('/', require('./routes/pages'));
app.use('/auth' ,require('./routes/auth2'));
app.use('/team', require('./routes/team'));
app.use('/api', require('./routes/api'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('El server esta escuchando en el puerto 5k');
});