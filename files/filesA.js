const multer = require('multer');
const path = require('path');
var fs = require('fs');

const storage = multer.diskStorage({
    //destination: __dirname + "/material/",
    destination: function (req, res, cb) {
        let dest = path.join(__dirname ,"material", req.body.id_grupo , req.body.titulo);
        var stat = null;
        try {
            stat = fs.statSync(dest);
        } catch (err) {
            fs.mkdirSync(dest);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        } 
        return cb(null, dest );
    } ,
    filename: function (req, file, cb) {
        let fileExtension = file.originalname.split('.')[1];
        const fileName = file.originalname;
        cb(null, fileName);
    },
    
});

const upload = multer({
    storage
}).single("archivo");

module.exports = upload;