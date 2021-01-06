const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: __dirname + "/profile",
});

const upload = multer({
    storage
}).single("archivo");

module.exports = upload;