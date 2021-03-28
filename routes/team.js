const express = require('express');
const controller = require('../controllers/teams');
const router = express.Router();
const uploadEntrega = require('../files/entrega');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/add', checkAuthenticated, controller.verCrear);
router.get("/asignacion", checkAuthenticated, controller.verAsignacion);
router.get('/myteam', checkAuthenticated, controller.verAsignaciones);
router.post('/add', checkAuthenticated, controller.crear);
router.post('/join', checkAuthenticated, controller.entrar);
router.post('/addTarea', checkAuthenticated, controller.addAsignacion);
router.post("/addEntrega",checkAuthenticated, controller.entregarAsignacion);
router.post("/calificar",checkAuthenticated, controller.calificar);
module.exports = router;  