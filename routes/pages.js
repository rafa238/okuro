const express = require('express');
const router = express.Router();
const consultas = require('../database/consultas');

const isLogged = (req, res, next) => {
    if (req.cookies.Galletita) {
        next();
    } else {
        res.redirect("/");
    }
}

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
router.get('/inicio', isLogged, async (req, res) => {

    try {
        const grupos = await consultas.getGrupos(req.cookies.Galletita);
        const [{ id_usuario, nombre, apellido, email, imagen, permiso_id_permiso },] = await consultas.getUsuario(req.cookies.Galletita);
        res.render('inicio', { id_usuario, nombre, apellido, email, imagen, grupos });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }

});
router.get('/logout', isLogged, (req, res) => {
    let cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 0 * 1000),
        httpOnly: true
    }
    res.cookie('Galletita', 0, cookieOptions);
    res.redirect("/");
});


module.exports = router;