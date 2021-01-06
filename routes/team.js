const { decodeBase64 } = require('bcryptjs');
const express = require('express');
const controller = require('../controllers/teams');
const router = express.Router();
const consultas = require('../database/consultas');
const upload = require('../files/filesA');


const isLogged = (req, res, next) => {
    if (req.cookies.Galletita) {
        next();
    } else {
        res.redirect("/");
    }
}

router.get('/add', isLogged, async (req, res) => {
    try {
        const [{ id_usuario, nombre, apellido, email, imagen },] = await consultas.getUsuario(req.cookies.Galletita);
        res.render('añadir-grupo', { id_usuario, nombre, apellido, email, imagen });
    } catch (error) { res.redirect("/");}
});

router.post('/add', isLogged , controller.add);
router.post('/join', isLogged, controller.join);
router.get('/myteam', isLogged, controller.esPropietario);

router.post('/addTarea',upload,function (req, res){  
    console.log(req.body); // object of inputs
    console.log("Titulo: " + req.body.titulo);
    console.log("Date:" + req.body.instrucciones);
    console.log("Date:" + req.body.date);
    console.log("Time: " + req.body.time);
    res.send("OK");
});

module.exports = router;  