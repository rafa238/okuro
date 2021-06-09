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

user.modificar = (user, id_usuario) => {
    console.log(user);
    console.log(id_usuario);
    return new Promise((resolve, reject) => {
        pool.query('update usuario set ? where id_usuario = ?', [user, id_usuario], async (err, result) => {
            if (err) reject(err)
            resolve(result)
        });

    });
}

user.obtener2 = (id_usuario) => {
    return new Promise((resolve, reject) => {
        pool.query('select * from usuario where id_usuario = ?', [id_usuario], async (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

module.exports = user;