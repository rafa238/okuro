const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const upload = require('../files/files');
const passport = require("passport");

router.post('/register', upload, authController.register );
router.post('/login', passport.authenticate('local', {
    successRedirect: "/inicio",
    failureRedirect: "/failed",
}));

module.exports = router;    