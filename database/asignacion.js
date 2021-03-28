const pool = require("../database/db");

const Asignacion = function (asignacion) {
    this.id_grupo = asignacion.id_grupo,
    this.vencimiento = asignacion.vencimiento,
    this.asignado = asignacion.asignado,
    this.titulo = asignacion.titulo,
    this.instrucciones = asignacion.instrucciones
}

Asignacion.obtenerTodas = (id_grupo, result) => {
    pool.query("SELECT * FROM asignacion WHERE id_grupo = ?", [id_grupo], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

Asignacion.obtenerAsignacion = (id_grupo, id_asignacion, result) => {
    pool.query("SELECT * FROM asignacion WHERE id_grupo = ? AND id_asignacion=?", [id_grupo, id_asignacion], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

Asignacion.insertAsignacion = (newAsignacion, result) => {
    pool.query(`INSERT INTO asignacion SET ?`, newAsignacion, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created asignacion: ", { id: res.insertId, ...newAsignacion });
        result(null, { id: res.insertId, ...newAsignacion });
    });
}
Asignacion.insertarMaterial = (newMaterial, result) => {
    pool.query(`INSERT INTO material SET ?`, newMaterial, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created material: ", { id: res.insertId, ...newMaterial });
        result(null, { id: res.insertId, ...newMaterial });
    });
}
module.exports = Asignacion;
/*
module.exports = {
    obtenerTodas: (id_grupo) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM asignacion WHERE id_grupo = ?", [id_grupo], (err, result) => {
                if (err) reject(err)
                resolve(result)
            });
        });
    },
    obtenerAsignacion: (id_grupo, id_asignacion) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM asignacion WHERE id_grupo = ? AND id_asignacion=?", [id_grupo, id_asignacion], (err, result) => {
                if (err) reject(err)
                resolve(result)
            });
        });
    },
    insertAsignacion: (id_grupo, vencimiento, titulo, instrucciones) => {
        return new Promise((resolve, reject) => {
            const normalizedDate = moment().tz("America/Mexico_City").format();
            pool.query(`INSERT INTO asignacion VALUES (default, ?, ?, ?, ?, ?)`, [id_grupo, vencimiento, normalizedDate, titulo, instrucciones], (err, result) => {
                if (err) reject(err);
                resolve(result)
            });
        });
    },
    hacerEntrega: (id_usuario, id_asignacion) => {
        return new Promise((resolve, reject) => {
            let normalizedDate = new Date(Date.now()).toISOString();
            pool.query(`INSERT INTO entrega VALUES (default, ? , ?, 1, ?, 0)`, [id_usuario, id_asignacion, normalizedDate], (err, result) => {
                if (err) reject(err)
                resolve(result)
            });
        });
    },
    obtenerEntrega: (id_usuario, id_asignacion) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT id_entrega FROM entrega WHERE id_usuario = ? AND id_asignacion = ?", [id_usuario, id_asignacion], (err, result) => {
                if (err) reject(err)
                resolve(result)
            });
        });
    },
    insertarEntregable: (id_entrega, ruta, filename) => {
        return new Promise((resolve, reject) => {
            let normalizedDate = new Date(Date.now()).toISOString();
            pool.query(`INSERT INTO entregable VALUES (default, ?, ?, ?);`, [id_entrega, ruta, filename], (err, result) => {
                if (err) reject(err)
                resolve(result)
            });
        });
    },
    insertarMaterial: (id_asignacion, ruta, nombre) => {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO material VALUES (default, ?, ?, ?)`, [id_asignacion, ruta, nombre], (err, result) => {
                if (err) reject(err);
                resolve(result)
            });
        });
    }
}*/