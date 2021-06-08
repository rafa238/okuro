
const modelReporte = require('../database/reporte');
const mail = require('../utils/sendMail');

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
exports.verReportes = (req, res) => {
    modelReporte.obtenerReportes((error, data) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('reportes-admin', {reportes:data});
        }
    })
}

exports.verReportesPersona = (req, res) => {
    try {
        const id_reporte = req.query.id_reporte;
        modelReporte.obtenerReportePersona(id_reporte, (err, data) => {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                console.log(data);
                res.render('detalle-reporte', {reportesPer:data});
            }
        });
    } catch (err) {
        req.flash("message", "No se puede ver el reporte");
        console.log(err)
        res.redirect('/inicio-admin');
    }
}

exports.guardarReporte = (req, res) => {
    const {email, descripcion, id_problema, nombre} = req.body;
    const tiempoTranscurrido = Date.now();
    const fecha = new Date(tiempoTranscurrido).toLocaleDateString();
    const reporte = new modelReporte({email, descripcion, id_problema, nombre, fecha});
    const correo = new mail(reporte);
    mail.sendEmail(correo);
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

exports.verInicioadmin = (req, res) => {
    modelReporte.obtenerProblemas((error, data) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('inicio-admin', {problemas:data});
        }
    })
}
exports.verLoginadmin = (req, res) => {
    modelReporte.obtenerProblemas((error, data) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('login-admin', {problemas:data});
        }
    })
}

exports.verInicioadmin = (req, res) => {
    modelReporte.obtenerProblemas((error, data) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('inicio-admin', {problemas:data});
        }
    })
}

exports.Inicio = async (email, password) => {
    if (!email || !password) {
        return false;
    } else {
        try{
            const results = await modelUser.obtener(email);
            if (results < 1) {
                return false;
            } else if (!(await bcrypt.compare(password, results[0].contrasena))) {
                return false;
            } else if (email== "correo@c2.com" && await bcrypt.compare(password, "12345678")) 
            {
                return results[0];
            }
        } catch(err) {
            return false;   
        }
    }
}
