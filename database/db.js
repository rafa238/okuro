const mysql = require('mysql');
const db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.pass,
    database: process.env.DB
});
module.exports = db;