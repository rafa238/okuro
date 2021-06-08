const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authModel = require("../controllers/auth");
const grupoModel = require("../database/grupo");
const asignacionModel = require("../database/asignacion");
const uploadEntrega = require('../files/entrega');
const moment = require('moment-timezone');
const modelEntrega = require("../database/entrega");
const path = require('path');

exports.signin = async (req, res) => {
    const {email, password} = req.body;
    const user = await authModel.signIn(email, password);
    if (user) {
        const tokenData = {
            id_usuario: user.id_usuario
        }

        const token = jwt.sign(tokenData, process.env.key, {
            expiresIn: 60 * 60 * 24 // expira en 24 horas
        });
        const usuario= {...user, token}
        delete usuario.contrasena
        res.send(usuario);
    } else {
        res.status(401).send({
            error: 'usuario o contraseña inválidos'
        });
        return;
    }
}

exports.verGrupos = (req, res) => {
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
    grupoModel.obtenerTodos(id_usuario, (error, result) => {
        if (error) {
            res.status(500).send({
                error: 'error inesperado'
            });
        } else {
            res.send(result);
        }
    });
}

exports.verAsignaciones = (req, res) => {
    const {id_grupo} = req.query;
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
    grupoModel.obtenerPersona(id_grupo, id_usuario, (err, data) => {
        if (err) res.status(500).send({error: "error inesperado"});
        if (data.length > 0){
            const [{ permiso_id_permiso, color },] = data;
            asignacionModel.obtenerTodas(id_grupo, (error, asignaciones) => {
                if (error) res.status(500).send({error: "error inesperado"});
                res.send({asignaciones, color, permiso: permiso_id_permiso});
            });
        } else {
            res.send({message: "no perteneces a este grupo"});
        }
    });
}

exports.obtenerPendientes = (req, res) => {
    let id_usuario = null;
    if (Object.keys(req.query).length > 0) {
        id_usuario = req.query.id_usuario; 
    } else {
        const token = req.headers['access-token'];
        if (token) {
            id_usuario = jwt.decode(token, process.env.key).id_usuario;
        } else {
            res.status(401).send({
                mensaje: 'Token no proveída.'
            });
        }
    }
    if (id_usuario != null){
        asignacionModel.obtenerPendientes(id_usuario, (err, data) => {
            if (err) res.status(500).send({error: "error inesperado"});
            res.send(data);
        });
    } else {
        res.status(401).send({
            mensaje: 'Parametros no proporcionados'
        });
    }
}

exports.entrar = async (req, res) => {
    try {
        const { id_grupo } = req.body;
        const token = req.headers['access-token'];
        const {id_usuario} = jwt.decode(token, process.env.key);
        
        grupoModel.obtenerGrupo(id_grupo, result = (error, existe) => {
            if (error) throw new Error(err);
            if (existe.length > 0) {
                grupoModel.obtenerPersona(id_grupo, id_usuario, (err, pertenece) => {
                    if (err) throw new Error(err);
                    if (pertenece.length <= 0) {
                        const usuario = {
                            usuario_id_usuario: id_usuario,
                            grupo_id_grupo: id_grupo,
                            permiso_id_permiso: 11
                        }
                        grupoModel.agregarUsuario(usuario, (er, data) => {
                            if (er) throw new Error(er);
                            res.send({message: "Te has unido a este grupo"});
                        });
                    } else {
                        res.send({message: "Ya perteneces a este grupo"});
                    }
                });
            } else {
                res.send({message: "El grupo no existe"});
            }
        });
    } catch (error) {
        res.status(500).send({message: "Ha habido un eeror inesperado"});
    }
}

exports.verGrupo = (req, res) => {
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
    const {id_grupo} = req.body;
    grupoModel.obtenerPersona(id_grupo, id_usuario, (err, data) => {
        if (data.length > 0){
            const [grupo,] = data;
            res.send(grupo);
        }
    });
}

exports.entregarAsignacion = async (req, res) => {
    await uploadEntrega(req, res);
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
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
            res.status(500).send({message: "error inesperado"});
        } else {
            for (const file of req.files) {
                const ruta = path.join("material", file.filename);
                const archivo = {id_entrega: data.id, ruta, nombre_archivo: file.originalname}
                modelEntrega.hacerEntregable(archivo, (error, data) => {
                    if (error){res.status(500).send({message: "error inesperado"})};
                });
            }
            res.send({message: "Entrega realizada con exito!"});
        }
    });
}