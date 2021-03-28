const express = require('express');
const router = express.Router();
const modelGrupo = require('../database/grupo')

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/inicio');
    }
    next();
}

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/inicio', checkAuthenticated, async (req, res) => {
    const { id_usuario, nombre, imagen } = req.session;
    modelGrupo.obtenerTodos(id_usuario, (error, grupos) => {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            res.render('inicio', { id_usuario, nombre, imagen, grupos});
        }
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/failed', (req, res) => {
    res.send("Usuario y/o contraseña incorrectos :( <a href='/'>Volver</a>")
});

module.exports = router;