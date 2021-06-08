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
            result(err, null);
            return;
        }

        result(null, res);
    });
}

Asignacion.obtenerAsignacion = (id_grupo, id_asignacion, result) => {
    pool.query("SELECT * FROM asignacion JOIN material ON asignacion.id_asignacion = material.id_asignacion WHERE asignacion.id_grupo = ? AND asignacion.id_asignacion=?", [id_grupo, id_asignacion], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
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

Asignacion.obtenerPendientes = (id_usuario, result) => {
    pool.query(`SELECT titulo, vencimiento, color, grupo.nombre, asignacion.id_asignacion, asignacion.id_grupo, asignacion.instrucciones FROM detalle_grupo 
    INNER JOIN grupo ON detalle_grupo.grupo_id_grupo=grupo.id_grupo
    INNER JOIN asignacion ON grupo.id_grupo=asignacion.id_grupo
    WHERE detalle_grupo.usuario_id_usuario=? 
    AND asignacion.vencimiento > DATE_SUB(NOW(), INTERVAL 5 HOUR)
    AND detalle_grupo.permiso_id_permiso =11;`, [id_usuario], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, res);
    });
}
module.exports = Asignacion;