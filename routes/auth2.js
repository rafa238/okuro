const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const upload = require('../files/img-perfil');


router.post('/register', upload , authController.register );
router.post('/login', authController.login );
router.get('/logout', authController.imprime);

module.exports = router;    
