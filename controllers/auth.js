const bcrypt = require('bcryptjs');
const modelUser = require("../database/user");

exports.signIn = async (email, password) => {
    if (!email || !password) {
        return false;
    } else {
        try{
            const results = await modelUser.obtener(email);
            if (results < 1) {
                return false;
            } else if (!(await bcrypt.compare(password, results[0].contrasena))) {
                return false;
            } else {
                return results[0];
            }
        } catch(err) {
            return false;   
        }
    }
}

exports.register = async (req, res) => {
    let imagen = req.file;
    const { name, lastName, email, password } = req.body;
    //console.log("Los datos del registro son ----->" + imagen, name, lastName, email, password);
    if (!email || !password || !name || !lastName || !imagen) {
        req.flash("message", "Llena todos los campos");
        res.redirect('/register');
    } else {
        imagen = req.file.filename.trim();
        const results = await modelUser.obtener(email);
        if (results.length > 0) {
            req.flash("message", "Email y/o contraseña ya en uso");
            res.status(401).redirect('/register');
        } else {
            let crypPass = await bcrypt.hash(password, 5);
            modelUser.register({nombre: name, apellido: lastName, contrasena: crypPass, email: email, imagen: imagen}).then((result) => {
                console.log("-----> Usuario registrado con exito");
                req.flash("message", "Usuario registrado con exito");
                res.status(200).redirect('/login');
            }).catch(error => console.log(error));
        }
    }
}

