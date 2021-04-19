const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const controller = require("../controllers/api_controller");

const islogued = (req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, process.env.key, (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({
            mensaje: 'Token no proveída.'
        });
    }
}

router.post('/login', controller.signin);
router.get('/verGrupos', islogued ,controller.verGrupos);
router.get('/verAsigaciones', islogued, controller.verAsignaciones);

module.exports = router;