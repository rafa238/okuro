const multer = require('multer');
const path = require('path');
const fs = require('fs');
const random = require("../utils/random");
const util = require("util");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        let dest = path.join(__dirname, "material");
        var stat = null;
        try {
            stat = fs.statSync(dest);
        } catch (err) {
            fs.mkdirSync(dest, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('No existe el directorio en "' + dest + '"');
        } 
        return cb(null, dest );
    } ,
    filename: function (req, file, cb) {
        let fileExtension = file.originalname.split('.')[1];
        const fileName = random(5) + "." + fileExtension;
        cb(null, fileName);
    },
    
});

const upload = multer({
    storage
}).any();
//.array("archivo", 5);
var uploadFilesMiddleware = util.promisify(upload);

module.exports = uploadFilesMiddleware;