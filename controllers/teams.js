const db = require("../database/consultas");


exports.add = (req, res) => {
    const { nombreGrupo, descripcionGrupo, colorGrupo } = req.body;

    console.log("Los datos del grupo son ----->", nombreGrupo, descripcionGrupo, colorGrupo, "del usuario: " + req.cookies.Galletita);
    if (!descripcionGrupo || !colorGrupo || !nombreGrupo) {
        req.flash("message", "Llena todos los campos");
        res.redirect('/team/add');
    } else {
        db.insertGrupo({ nombre: nombreGrupo, color: colorGrupo, descripcion: descripcionGrupo }, req.cookies.Galletita).then((result) => {
            console.log(" ----------> Grupo registrado con exito");
            req.flash("message", "Grupo creado con exito");
            res.redirect('/team/add');
        }).catch((err) => {
            req.flash("message", "Ha ocurrido un error inesperado, intentalo de nuevo");
            res.redirect('/team/add');
        });
    }
}