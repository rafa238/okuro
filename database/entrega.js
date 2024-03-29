const pool = require("../database/db");

const Entrega = function (entrega) {
    this.id_usuario = entrega.id_usuario;
    this.id_asignacion = entrega.id_asignacion;
    this.fecha = entrega.fecha;
    this.calificacion = entrega.calificacion;
};

Entrega.hacerEntrega = (newEntrega, result) => {
    pool.query(`INSERT INTO entrega SET ?`, newEntrega, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created entrega: ", { id: res.insertId, ...newEntrega });
        result(null, { id: res.insertId, ...newEntrega });
    });
}

Entrega.obtenerEntregas = (id_asignacion, result) => {
    pool.query(`SELECT asignacion.id_asignacion, asignacion.id_grupo, usuario.id_usuario, usuario.nombre, entrega.id_entrega, fecha FROM asignacion 
    INNER JOIN detalle_grupo ON detalle_grupo.grupo_id_grupo = asignacion.id_grupo
    RIGHT JOIN usuario ON detalle_grupo.usuario_id_usuario = usuario.id_usuario AND detalle_grupo.permiso_id_permiso != 1
    LEFT JOIN entrega ON asignacion.id_asignacion = entrega.id_asignacion AND usuario.id_usuario = entrega.id_usuario
    WHERE asignacion.id_asignacion = ?;`, [id_asignacion], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, res);
    });
}

Entrega.obtenerEntrega = (id_usuario, id_asignacion, result) => {
    pool.query(`SELECT asignacion.id_asignacion, entrega.id_entrega, fecha, calificacion, ruta, nombre_archivo FROM asignacion 
    LEFT JOIN entrega ON entrega.id_asignacion=asignacion.id_asignacion AND entrega.id_usuario=?
    LEFT JOIN entregable ON entregable.id_entrega = entrega.id_entrega
    WHERE asignacion.id_asignacion=?`, [id_usuario, id_asignacion], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, res);
    });
}

Entrega.hacerEntregable = (newEntregable, result) => {
    pool.query(`INSERT INTO entregable SET ?`, newEntregable, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created entregable: ", { id: res.insertId, ...newEntregable });
        result(null, { id: res.insertId, ...newEntregable });
    });
}

Entrega.calificar = (calificacion, id_entrega, result) => {
    pool.query(`UPDATE entrega SET calificacion=?, id_status=1 WHERE id_entrega=?;`, [calificacion, id_entrega], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            return;
        }
        console.log(res)
        result(null, res);
    });
}

module.exports = Entrega;