const express = require('express');
const controller = require('../controllers/teams');
const router = express.Router();
const consultas = require('../database/consultas');
const upload = require('../files/filesA');
const uploadEntrega = require('../files/entrega');

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
    } catch (error) {
        res.redirect("/");
    }
});

router.post('/add', isLogged, controller.add);
router.post('/join', isLogged, controller.join);
router.get('/myteam', isLogged, controller.asignaciones);
router.post('/addTarea', upload, controller.addAsignacion);
router.get("/asignacion", isLogged, controller.verAsignacion);
router.post("/addEntrega", uploadEntrega, controller.entregarAsignacion);
router.post("/calificar", controller.calificar);
module.exports = router;  