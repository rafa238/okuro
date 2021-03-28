const pool = require("../database/db");
const user = {};

user.obtener = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('select * from usuario where email = ?', [email], async (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

user.register = (user) => {
    return new Promise((resolve, reject) => {
        pool.query('insert into usuario set ?', user, async (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

module.exports = user;