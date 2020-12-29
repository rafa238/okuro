const mysql = require('mysql');
const db_config = {
    user: process.env.user,
    host: process.env.host,
    password: process.env.pass,
    database: process.env.DB,
    multipleStatements: true,
}

const pool = mysql.createPool(db_config);
  
module.exports = pool;