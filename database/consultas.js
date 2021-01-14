const pool = require("../database/db");

const getUsuario = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [id], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getColor = (id_grupo) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT color FROM grupo WHERE id_grupo = ?", [id_grupo], (err, result) => {
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

const insertGrupo = (grupo, id) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO grupo SET ?; 
        SET @team_id = LAST_INSERT_ID(); 
        INSERT INTO detalle_grupo VALUES (?, @team_id, 1)`, [grupo, id], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const entrarGrupo = (id_grupo, id_usuario) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO detalle_grupo VALUES (?, ? , 11)`, [id_usuario, id_grupo], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getGrupoById = (id_grupo) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM grupo WHERE id_grupo = ?", [id_grupo], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getPersonaDeGrupo = (id_grupo, id_usuario) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM detalle_grupo WHERE usuario_id_usuario = ? AND grupo_id_grupo=?", [id_usuario, id_grupo], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getPersonasDeGrupo = (id_grupo) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM detalle_grupo WHERE grupo_id_grupo = ?", [id_grupo], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const insertAsignacion = (id_grupo, vencimiento, titulo, instrucciones, ruta) => {
    return new Promise((resolve, reject) => {
        let normalizedDate = new Date(Date.now()).toISOString();
        pool.query(`INSERT INTO asignacion VALUES (default, ?, ?, ?, ?, ?);
        SET @asignacion_id = LAST_INSERT_ID();
        INSERT INTO material VALUES (default, @asignacion_id, ? );`, [id_grupo, vencimiento, normalizedDate, titulo, instrucciones, ruta], (err, result) => {
            if (err) reject(err);
            resolve(result)
        });
    });
}

const getAsignaciones = (id_grupo) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM asignacion WHERE id_grupo = ?", [id_grupo], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getAsignacion = (id_grupo, id_asignacion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM asignacion WHERE id_grupo = ? AND id_asignacion=?", [id_grupo, id_asignacion], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getMaterial = (id_asignacion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM material WHERE id_asignacion=?", [id_asignacion], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const insertEntrega = (id_usuario, id_asignacion, ruta, filename) => {
    return new Promise((resolve, reject) => {
        let normalizedDate = new Date(Date.now()).toISOString();
        pool.query(`INSERT INTO entrega VALUES (default, ? , ?, 1, ?, 0);
        SET @entrega_id = LAST_INSERT_ID();
        INSERT INTO entregable VALUES (default, @entrega_id, ?, ?);`, [id_usuario, id_asignacion, normalizedDate, ruta, filename], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getEntrega = (id_usuario, id_asignacion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM entrega  INNER JOIN entregable ON entrega.id_entrega = entregable.id_entrega WHERE id_usuario=? AND id_asignacion=?", [id_usuario, id_asignacion], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const getEntregas = (id_asignacion) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM entrega 
        INNER JOIN entregable ON entrega.id_entrega = entregable.id_entrega 
        INNER JOIN usuario ON entrega.id_usuario = usuario.id_usuario
        WHERE id_asignacion = ?`, [id_asignacion], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

const calificar = (calificacion, id_entrega) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE entrega SET calificacion=? WHERE id_entrega=?;`, [calificacion, id_entrega], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}

module.exports = {
    getUsuario,
    insertGrupo,
    getGrupos,
    getColor,
    entrarGrupo,
    getGrupoById,
    getPersonasDeGrupo,
    getPersonaDeGrupo,
    insertAsignacion,
    getAsignaciones,
    getAsignacion,
    getMaterial,
    insertEntrega,
    getEntrega,
    getEntregas,
    calificar,
}