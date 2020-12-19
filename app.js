const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require ('cookie-parser');
const session = require('express-session');
const formidable = require('express-formidable');
const multer = require('multer');

//let session_middleware = require('./middewares/session')



dotenv.config({ path: './.env' });

const app = express();  


const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.DB
});

const publicFiles = path.join(__dirname, './public');
app.use(express.static(publicFiles));

app.use(express.urlencoded({
    extended:false
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "Rafanoesuntirano,yesbienagradecido",
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'hbs');

const storage = multer.diskStorage({
    destination: __dirname + "/public/imagenes",
});

const upload = multer({
    storage
}).single("image");
 



app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth2'));


app.listen(5000, () =>{
    console.log('El server esta escuchando en el puerto 5k');
});