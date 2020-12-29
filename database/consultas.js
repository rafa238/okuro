const pool = require("../database/db");

const getUsuario = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [id], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getGrupos = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM detalle_grupo INNER JOIN grupo ON detalle_grupo.grupo_id_grupo = grupo.id_grupo WHERE usuario_id_usuario=?", [id], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const insertGrupo = (grupo,id) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO grupo SET ?; 
        SET @team_id = LAST_INSERT_ID(); 
        INSERT INTO detalle_grupo VALUES (?, @team_id, 1)`, [grupo, id], (err, result) => {
            if(err) reject(err)
            resolve(result)
        });
    });
}



module.exports = {
    getUsuario,
    insertGrupo,
    getGrupos,
}