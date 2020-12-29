const express = require('express');
const controller = require('../controllers/teams');
const router = express.Router();
const consultas = require('../database/consultas');

router.get('/add', (req, res) => {
    if (req.cookies.Galletita) {
        consultas.getUsuario(req.cookies.Galletita).then((results)=> {
            res.render('añadir-grupo', {
                id : req.cookies.Galletita,
                nombre: results[0].nombre,
                apellido: results[0].apellido,
                email: results[0].email,
                foto: results[0].imagen
            });
        }).catch((error) => {
            res.redirect("/")
            console.log(error);
        });
    } else {
        res.redirect("/")
    }
});

router.post('/add', controller.add);

module.exports = router;  