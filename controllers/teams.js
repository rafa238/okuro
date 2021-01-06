const db = require("../database/consultas");
var fs = require('fs');
const util = require('util');

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

exports.join = async (req, res) => {
    try {
        const { id_grupo } = req.body;
        const id_usuario = req.cookies.Galletita;
        console.log(`El usuario ${id_usuario} quiere unirse al grupo ${id_grupo}`);
        const existe = await db.getGrupoById(id_grupo);
        console.log(existe);
        if (existe.length > 0) {
            const pertenece = await db.getPersonaDeGrupo(id_grupo, id_usuario);
            if (pertenece.length <= 0) {
                await db.entrarGrupo(id_grupo, id_usuario);
                req.flash("message", "Te has unido al grupo");
                res.redirect('/inicio');
            } else {
                req.flash("message", "Ya perteneces a este grupo");
                res.redirect('/inicio');
            }
        } else {
            req.flash("message", "El grupo no existe ");
            res.redirect('/inicio');
        }
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
    }
}

exports.esPropietario = async (req, res) => {
    try {
        let team = req.query.id_grupo;
        let id_persona = req.cookies.Galletita;
        const [{permiso_id_permiso},] = await db.getPersonaDeGrupo(team,id_persona);
        console.log(permiso_id_permiso);
        //comprobamos que sea el dueño
        if (permiso_id_permiso === 1) {
            const [{ id_usuario, nombre, apellido, email, imagen },] = await db.getUsuario(req.cookies.Galletita);
            res.render('myTeam', { id_usuario, nombre, apellido, email, imagen, team });
        }else{
            //si no es el dueñp de grupo aqui vamos a redirigir en caso de que no sea el lider
            res.send("No eres lider de este grupo")
        }
    } catch (error) { req.flash("message", "Ha ocurrido un error inesperado"); res.redirect('/inicio');}
}