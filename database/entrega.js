const pool = require("../database/db");

const Entrega = function (entrega) {
    this.id_usuario = entrega.id_usuario;
    this.id_asignacion = entrega.id_asignacion;
    this.id_status = entrega.id_status;
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
    /*
    SELECT * FROM entrega 
    INNER JOIN entregable ON entrega.id_entrega = entregable.id_entrega 
    INNER JOIN usuario ON entrega.id_usuario = usuario.id_usuario
    WHERE id_asignacion = ?
    */
    pool.query(`SELECT asignacion.id_asignacion, usuario.id_usuario, usuario.nombre, entrega.id_entrega, fecha, entregable.nombre_archivo FROM asignacion 
        INNER JOIN detalle_grupo ON detalle_grupo.grupo_id_grupo = asignacion.id_grupo
        RIGHT JOIN usuario ON detalle_grupo.usuario_id_usuario = usuario.id_usuario
        LEFT JOIN entrega ON asignacion.id_asignacion = entrega.id_asignacion AND usuario.id_usuario = entrega.id_usuario
        LEFT JOIN entregable ON entrega.id_entrega = entregable.id_entrega
        WHERE asignacion.id_asignacion = ?`, [id_asignacion], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
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