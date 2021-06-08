const express = require('express');
const router = express.Router();
const controller = require("../controllers/pagesc");
const modelGrupo = require('../database/grupo');
const passport = require("passport");

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

router.get('/inicio2', (req, res) => {
    res.render('inicio2', {});
});

router.get('/info', (req, res) => {
    res.render('info', {});
});

router.get('/quejas', controller.verQuejas);
router.get('/reportes-admin', controller.verReportes);
router.get('/myreport', controller.verReportesPersona);
router.get('/inicio-admin', controller.verInicioadmin);
router.get('/login-admin', controller.verLoginadmin);

router.post('/login-admin', passport.authenticate('local', {
    successRedirect: "/inicio-admin",
    failureRedirect: "/failed",
}));
router.post('/addReporte', controller.guardarReporte);

module.exports = router;