const db = require("../database/consultas");
const path = require('path');

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

exports.asignaciones = async (req, res) => {
    try {
        let team = req.query.id_grupo;
        let id_persona = req.cookies.Galletita;
        const [{ permiso_id_permiso },] = await db.getPersonaDeGrupo(team, id_persona);
        //comprobamos que sea el dueño
        if (permiso_id_permiso === 1) {
            const asignaciones = await db.getAsignaciones(team);
            const [{ color, }] = await db.getColor(team);
            const [{ id_usuario, nombre, apellido, email, imagen },] = await db.getUsuario(req.cookies.Galletita);
            res.render('myTeam', { id_usuario, nombre, apellido, email, imagen, team, asignaciones, color });
        } else if (permiso_id_permiso === 11) {
            //si no es el dueñp de grupo aqui vamos a redirigir en caso de que no sea el lider
            const asignaciones = await db.getAsignaciones(team);
            const [{ color, }] = await db.getColor(team);
            const [{ id_usuario, nombre, apellido, email, imagen },] = await db.getUsuario(req.cookies.Galletita);
            res.render('asignaciones', { id_usuario, nombre, apellido, email, imagen, color, asignaciones });
        }
    } catch (error) {
        req.flash("message", "No perteneces a este grupo");
        res.redirect('/inicio');
    }
}

exports.addAsignacion = async (req, res) => {
    try {
        let ruta = `/material/${req.body.id_grupo}/${req.body.titulo}/${req.file.filename}`;
        let vencimiento = `${req.body.date} ${req.body.time}:00`;
        await db.insertAsignacion(req.body.id_grupo, vencimiento, req.body.titulo, req.body.instrucciones, ruta);
        res.send("Añadido");
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
    }
}

exports.verAsignacion = async (req, res) => {
    try {
        let team = req.query.id_grupo;
        let asig = req.query.id_asignacion;
        let id_persona = req.cookies.Galletita;
        const [{ permiso_id_permiso },] = await db.getPersonaDeGrupo(team, id_persona);
        if (permiso_id_permiso === 1) {
            const [asignacion,] = await db.getAsignacion(team, asig);
            const entregas = await db.getEntregas(asig);
            console.log(entregas);
            const [{ id_usuario, nombre, apellido, email, imagen },] = await db.getUsuario(req.cookies.Galletita);
            res.render("entregas", { id_usuario, nombre, apellido, email, imagen, asignacion, entregas});
        } else if (permiso_id_permiso === 11) {
            const [asignacion,] = await db.getAsignacion(team, asig);
            const [{ id_usuario, nombre, apellido, email, imagen },] = await db.getUsuario(req.cookies.Galletita);
            const archivos = await db.getMaterial(asig);
            const entrega = await db.getEntrega(req.cookies.Galletita, asig);
            res.render("asignacion", { id_usuario, nombre, apellido, email, imagen, asignacion, archivos, entrega });
        }
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
        console.log(error);
    }
}

exports.entregarAsignacion = async (req, res) => {
    try {
        let dest = `/material/${req.body.id_grupo}/${req.body.titulo}/${req.cookies.Galletita}/${req.file.filename}`
        await db.insertEntrega(req.cookies.Galletita, req.body.id_asignacion, dest, req.file.filename);
        req.flash("message", "Entregado");
        res.redirect('/inicio');
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
        console.log(error);
    }
}

exports.calificar = async (req, res) => {
    try{
        const {calificacion,id_entrega} = req.body;
        await db.calificar(calificacion, id_entrega);
        res.redirect(req.headers.referer);
    }catch(error){

    }
}