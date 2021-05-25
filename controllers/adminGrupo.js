const modelGrupo = require("../database/grupo");
const modelAsig = require("../database/asignacion");
const modelEntrega = require("../database/entrega");
const uploadEntrega = require('../files/entrega');
const path = require('path');
const moment = require('moment-timezone');

exports.verAnadirAignacion = (req, res) => {
    try {
        const { id_usuario, nombre, imagen } = req.session;
        const id_grupo = req.query.id_grupo;
        res.render('agregar-asig', { id_usuario, nombre, imagen, id_grupo });
    } catch (error) {
        res.redirect("/");
    }
<<<<<<< HEAD
}
=======
} 

exports.verIniciarDirecto = (req, res) => {
    try {
        const { id_usuario, nombre, imagen } = req.session;
        const id_grupo = req.query.id_grupo;
        res.render('administrar-trans', { id_usuario, nombre, imagen, id_grupo });
    } catch (error) {
        res.redirect("/");
    }
} 
>>>>>>> 561f48084c7bcb73cfef84bb69e9c82cb5cdbdde
