const express = require('express');
const controller = require('../controllers/teams');
const adminController = require('../controllers/adminGrupo');
const router = express.Router();
const uploadEntrega = require('../files/entrega');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
/*Vistas del administrador*/
router.get('/addAsig', adminController.verAnadirAignacion);
router.get('/startDir', adminController.verIniciarDirecto);
router.get('/watchMie', adminController.verMiembrosgrupo);

router.get('/add', checkAuthenticated, controller.verCrear);
router.get("/asignacion", checkAuthenticated, controller.verAsignacion);
router.get('/myteam', checkAuthenticated, controller.verAsignaciones);
router.post('/add', checkAuthenticated, controller.crear);
router.post('/join', checkAuthenticated, controller.entrar);
router.post('/addTarea', checkAuthenticated, controller.addAsignacion);
router.post("/addEntrega",checkAuthenticated, controller.entregarAsignacion);
router.post("/calificar",checkAuthenticated, controller.calificar);
module.exports = router;  