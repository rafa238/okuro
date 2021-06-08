const modelGrupo = require("../database/grupo");
const modelAsig = require("../database/asignacion");
const modelEntrega = require("../database/entrega");
const uploadEntrega = require('../files/entrega');
const path = require('path');
const moment = require('moment-timezone');

//renderizar vista de crear un nuevo grupo
exports.verCrear = (req, res) => {
    try {
        const { id_usuario, nombre, imagen } = req.session;
        res.render('añadir-grupo', { id_usuario, nombre, imagen });
    } catch (error) {
        res.redirect("/");
    }
}

//ruta POST para crear un nuevo grupo
exports.crear = (req, res) => {
    const { id_usuario, nombre, imagen } = req.session;
    const { nombreGrupo, descripcionGrupo, colorGrupo } = req.body;
    console.log("Los datos del grupo son ----->", nombreGrupo, descripcionGrupo, colorGrupo, "del usuario: " + id_usuario);
    if (!descripcionGrupo || !colorGrupo || !nombreGrupo) {
        req.flash("message", "Llena todos los campos");
        res.redirect('/team/add');
    } else {
        const grupo = new modelGrupo ({ nombre: nombreGrupo, color: colorGrupo, descripcion: descripcionGrupo});
        modelGrupo.agregar(grupo, (err, data) => {
            if (err) {
                req.flash("message", "Ha ocurrido un error inesperado");
                res.status(500).redirect('/inicio');
            } else {
                const usuario = {
                    usuario_id_usuario: id_usuario,
                    grupo_id_grupo: data.id,
                    permiso_id_permiso: 1
                }
                modelGrupo.agregarUsuario(usuario, (error, datas) => {
                    if (error){
                        req.flash("message", "Ha ocurrido un error inesperado");
                        res.status(500).redirect('/inicio');
                    } else {
                        req.flash("message", "Grupo creado con exito");
                        res.redirect('/team/add');
                    }
                }); 
            }
        });
    }
}

//ruta post para entrar a un nuevo grupo
exports.entrar = async (req, res) => {
    try {
        const { id_grupo } = req.body;
        const { id_usuario, } = req.session;
        modelGrupo.obtenerGrupo(id_grupo, result = (error, existe) => {
            if (error) throw new Error(err);
            if (existe.length > 0) {
                modelGrupo.obtenerPersona(id_grupo, id_usuario, (err, pertenece) => {
                    if (err) throw new Error(err);
                    if (pertenece.length <= 0) {
                        const usuario = {
                            usuario_id_usuario: id_usuario,
                            grupo_id_grupo: id_grupo,
                            permiso_id_permiso: 11
                        }
                        modelGrupo.agregarUsuario(usuario, (er, data) => {
                            if (er) throw new Error(er);
                            req.flash("message", "Te has unido al grupo");
                            res.redirect('/inicio');
                        });
                    } else {
                        req.flash("message", "Ya perteneces a este grupo");
                        res.redirect('/inicio');
                    }
                });
            } else {
                req.flash("message", "El grupo no existe ");
                res.redirect('/inicio');
            }
        });
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
    }
}

//renderiza la vista de añadir/ver asignaciones
exports.verAsignaciones = (req, res) => {
    try {
        const { id_usuario, nombre, imagen } = req.session;
        const id_grupo = req.query.id_grupo;
        modelGrupo.obtenerPersona(id_grupo, id_usuario, (err, data) => {
            if (err) throw new Error(err);
            const [{ permiso_id_permiso, color },] = data;
            modelAsig.obtenerTodas(id_grupo, (error, asignaciones) => {
                if (error) throw new Error(error);
                if (permiso_id_permiso === 1) {
                    //es el propietario del grupo
                    res.render('detalle_grupo', { id_usuario, nombre, imagen, id_grupo, asignaciones, color });
                } else if (permiso_id_permiso === 11) {
                    //si no es el dueño de grupo aqui vamos a redirigir para que vea las asignaciones
                    res.render('asignaciones', { id_usuario, nombre, imagen,id_grupo, asignaciones, color });
                }
            });
        });
    } catch (error) {
        req.flash("message", "No perteneces a este grupo");
        console.log(error)
        res.redirect('/inicio');
    }
}

//ruta POST para añadir una asignacion
exports.addAsignacion = async (req, res) => {
    try {
        await uploadEntrega(req, res);
        const vencimiento = `${req.body.date} ${req.body.time}:00`;
        const {id_grupo, titulo, instrucciones} = req.body;
        const asignado = moment().tz("America/Mexico_City").format();
        const asignacion = new modelAsig({id_grupo, vencimiento,asignado, titulo, instrucciones});
        //const {insertId} = await modelAsig.insertAsignacion();
        modelAsig.insertAsignacion(asignacion, (err, data) => {
            if (err) throw new Error(err);
            for (const file of req.files) {
                const ruta = path.join("material", file.filename).trim();
                const material = {
                    id_asignacion: data.id,
                    ruta: ruta,
                    nombre: file.originalname
                }
                modelAsig.insertarMaterial(material, (error, data2) => {
                    if (error) throw new Error(error);
                });
            }
            res.status(200).send("ok");
        });
    } catch (error) {
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
    }
}

exports.verAsignacion = async (req, res) => {
    try {
        const {id_grupo, id_asignacion} = req.query;
        const { id_usuario, nombre, imagen } = req.session;
        modelGrupo.obtenerPersona(id_grupo, id_usuario, (err, data) => {
            if (err) throw new Error(err);
            const [{ permiso_id_permiso},] = data;
            modelAsig.obtenerAsignacion(id_grupo, id_asignacion, (error, asig) => {
                if (error) throw new Error(err);
                const [asignacion,] = asig;
                if (permiso_id_permiso === 1) {
                    modelEntrega.obtenerEntregas(id_asignacion, (er, entregas) =>{
                        if (er) throw new Error(err);
                        console.log(entregas)
                        
                        res.render("entregas", { id_usuario, nombre, imagen, entregas, asignacion, asig});
                    });
                } else if (permiso_id_permiso === 11) {
                    /*const archivos = await db.getMaterial(id_asignacion);
                    const entrega = await db.getEntrega(id_usuario, id_asignacion);*/
                    modelEntrega.obtenerEntrega(id_usuario, id_asignacion, (er, entrega) => {
                        res.render("asignacion", { id_usuario, nombre, imagen, asignacion, entrega});
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
        req.flash("message", "Ha ocurrido un error inesperado");
        res.redirect('/inicio');
    }
}

//ruta POST de entregar archivos de asignacion
exports.entregarAsignacion = async (req, res) => {
    await uploadEntrega(req, res);
    const { id_usuario, nombre, imagen } = req.session;
    const id_asignacion = req.body.id_asignacion;
    const fecha = moment().tz("America/Mexico_City").format();
    const entrega = new modelEntrega({
        id_usuario,
        id_asignacion,
        fecha,
        calificacion: 0,
    });
    modelEntrega.hacerEntrega(entrega, (error, data) => {
        if (error) {
            req.flash("message", "Ha ocurrido un error inesperado");
            res.status(500).redirect('/inicio');
        } else {
            for (const file of req.files) {
                const ruta = path.join("material", file.filename);
                const archivo = {id_entrega: data.id, ruta, nombre_archivo: file.originalname}
                modelEntrega.hacerEntregable(archivo, (error, data) => {
                    if (error) res.status(500).send('error');
                });
            }
            res.status(200).send("ok");
        }
    });
}

//ruta POST para calificar
exports.calificar = async (req, res) => {
    try {
        const { calificacion, id_entrega } = req.body;
        modelEntrega.calificar(calificacion, id_entrega, (err, data) => {
            res.redirect(req.headers.referer);
        });
    } catch (error) {

    }
}