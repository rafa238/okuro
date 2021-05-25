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

module.exports = Reporte; 