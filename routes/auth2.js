const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: "/public2/imagenes",
});


const upload = multer({
    storage
}).single("archivo");
 


router.post('/register', upload , authController.register );
router.post('/login', authController.login );

//router.get('/inicio', authController.consulta);
router.get('/logout', authController.imprime);




module.exports = router;    
