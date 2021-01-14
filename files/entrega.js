const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    //destination: __dirname + "/material/",
    destination: function (req, res, cb) {
        let dest = path.join(__dirname ,"material", req.body.id_grupo , req.body.titulo, req.cookies.Galletita);
        var stat = null;
        try {
            stat = fs.statSync(dest);
        } catch (err) {
            fs.mkdirSync(dest, { recursive: true }, (err) => {
                if (err) throw err;
              } );
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('No existe el directorio en "' + dest + '"');
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