const pool = require("../database/db");

const Grupo = function(grupo){
    this.nombre = grupo.nombre,
    this.color = grupo.color,
    this.descripcion = grupo.descripcion
}

Grupo.agregar = (newGrupo, result) => {
    pool.query(`INSERT INTO grupo SET ?`, newGrupo, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created grupo: ", { id: res.insertId, ...newGrupo });
        result(null, { id: res.insertId, ...newGrupo });
    });
}

Grupo.obtenerGrupo = (id_grupo, result) => {
    pool.query("SELECT * FROM grupo WHERE id_grupo = ?", [id_grupo], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

Grupo.agregarUsuario = (usuario, result) => {
    pool.query(`INSERT INTO detalle_grupo SET ?`, usuario, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...usuario });
    });
}

Grupo.obtenerPersona = (id_grupo, id_usuario, result) => {
    pool.query("SELECT * FROM detalle_grupo INNER JOIN grupo ON detalle_grupo.grupo_id_grupo = grupo.id_grupo WHERE usuario_id_usuario=? AND grupo_id_grupo=?", [id_usuario, id_grupo], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

Grupo.obtenerTodos = (id_usuario, result) => {
    pool.query("SELECT * FROM detalle_grupo INNER JOIN grupo ON detalle_grupo.grupo_id_grupo = grupo.id_grupo WHERE usuario_id_usuario=?", [id_usuario], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}


module.exports = Grupo;