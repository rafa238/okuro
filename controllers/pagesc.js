
const modelReporte = require('../database/reporte');
const moment = require('moment-timezone');

exports.verQuejas = (req, res) => {
    modelReporte.obtenerProblemas((error, data) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('quejas', {problemas:data});
        }
    })
}

exports.guardarReporte = (req, res) => {
    const {email, descripcion, id_problema, nombre} = req.body;
    const tiempoTranscurrido = Date.now();
    const fecha = new Date(tiempoTranscurrido).toLocaleDateString();
    const reporte = new modelReporte({email, descripcion, id_problema, nombre, fecha});
    modelReporte.guardarReporte(reporte, (err, data) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            req.flash("message", "Gracias por reportar, en breve evaluaremos el problema :)");
            res.redirect("/quejas");
        }
    });
}
