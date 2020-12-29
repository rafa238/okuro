const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const hbs = require("hbs");
dotenv.config({ path: './.env' });

const app = express();

app.use(session({
    secret: "aecret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    next();
});

const publicFiles = path.join(__dirname, '/public');
const imageFiles = path.join(__dirname, "files/profile");
app.use(express.static(publicFiles));
app.use("/image",express.static(imageFiles));
app.use("teams/image",express.static(imageFiles));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());
app.use(cookieParser());

hbs.registerPartials(__dirname + "/views/parciales");
app.set('view engine', 'hbs');

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth2'));
app.use('/team', require('./routes/team'), express.static(publicFiles));

app.listen(5000, () => {
    console.log('El server esta escuchando en el puerto 5k');
});