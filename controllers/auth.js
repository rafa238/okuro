const bcrypt = require('bcryptjs');
const connection = require("../database/db");

exports.login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("message", "LLena todos los campos");
        res.status(401).redirect('/login');
    } else {
        connection.query('select * from usuario where email = ?', [email], async (error, results) => {
            if (error){
                req.flash("message", "error inesperado");
                res.redirect('/login');
            } else if (results < 1) {
                req.flash("message", "Email y/o contraseña incorrectos");
                res.redirect('/login');
            } else if (!(await bcrypt.compare(password, results[0].contrasena))) {
                req.flash("message", "Email y/o contraseña incorrectos");
                res.status(401).redirect('/login');
            } else {
                let id = results[0].id_usuario;
                let cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('Galletita', id, cookieOptions);
                req.session.user_id = id;
                res.status(200).redirect("/inicio")
            }
        });
    }
};

exports.register = (req, res) => {
    let imagen = req.file;
    const { name, lastName, email, password } = req.body;

    console.log("Los datos del registro son ----->" + imagen, name , lastName, email, password);
    if(!email || !password || !name || !lastName || !imagen){
        req.flash("message", "Llena todos los campos");
        res.redirect('/register');
    }else{
        imagen = req.file.filename;
        connection.query('select email from usuario where email = ?', [email], async (error, results) => {
            if (error) {
                req.flash("message", "Ha ocurrido un error inesperado");
                res.status(401).redirect('/register');
            } else if (results.length > 0) {
                req.flash("message", "Email y/o contraseña ya en uso");
                res.status(401).redirect('/register');
            } else {
                let crypPass = await bcrypt.hash(password, 5);
                connection.query('insert into usuario set ?', { nombre: name, apellido: lastName, contrasena: crypPass, email: email, imagen: imagen }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(" ----------> Usuario registrado con exito");
                        req.flash("message", "Usuario registrado con exito");
                        res.status(200).redirect('/login');
                    }
                });
            }
        });
    }    
}


exports.imprime = (req, res) => {
    try {
        res.clearCookie("Galletita");
        console.log(req.cookies);
        res.status(200).redirect("/index");
    } catch (error) {
        console.log(error);
    }
}
