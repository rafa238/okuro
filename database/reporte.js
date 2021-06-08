const pool = require("../database/db");

const Reporte = function (reporte) {
    this.nombre = reporte.nombre;
    this.email = reporte.email;
    this.fecha = reporte.fecha;
    this.descripcion = reporte.descripcion;
    this.id_problema = reporte.id_problema; 
}

Reporte.guardarReporte = (newReporte, result) => {
    pool.query("INSERT INTO reporte SET ?", newReporte, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created reporte: ", { id: res.insertId, ...newReporte });
        result(null, { id: res.insertId, ...newReporte });
    });
}

Reporte.obtenerProblemas = (result) => {
    pool.query("SELECT * FROM c_problema", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
}

Reporte.obtenerReportes = (result) => {
    pool.query("SELECT * FROM reporte", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
}

Reporte.obtenerReportePersona = (id_reporte, result) => {
    pool.query("SELECT * FROM reporte INNER JOIN c_problema ON reporte.id_problema = c_problema.id_problema WHERE id_reporte=?;", [id_reporte], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

module.exports = Reporte; 