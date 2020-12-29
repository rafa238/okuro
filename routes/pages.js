const express = require('express');
const connection = require('../database/db');
const router = express.Router();
const consultas = require('../database/consultas');

router.get('/', (req, res) => {
    if (!(req.cookies.Galletita)) {
        res.render('index');
    } else {
        res.redirect("/inicio");
    }
});
router.get('/register', (req, res) => {
    if (!(req.cookies.Galletita)) {
        res.render('register');
    } else {
        res.redirect("/")
    }
});
router.get('/login', (req, res) => {
    if (!(req.cookies.Galletita)) {
        res.render('login');
    } else {
        res.redirect("/")
    }
});
router.get('/inicio', async (req, res) => {
    if (req.cookies.Galletita) {
        let grupos = await consultas.getGrupos(req.cookies.Galletita);
        consultas.getUsuario(req.cookies.Galletita).then((results)=> {
            res.render('inicio', {
                id : req.cookies.Galletita,
                nombre: results[0].nombre,
                apellido: results[0].apellido,
                email: results[0].email,
                foto: results[0].imagen,
                grupos: grupos
            });
        }).catch((error) => {
            res.redirect("/")
            console.log(error);
        });
    } else {
        res.redirect("/")
    }
});
router.get('/logout', (req, res) => {
    if (req.cookies.Galletita) {
        let cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 0 * 1000),
            httpOnly: true
        }
        res.cookie('Galletita', 0, cookieOptions);
        res.redirect("/");
    }else{
        res.redirect("/");
    }
});



module.exports = router;