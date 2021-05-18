const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authModel = require("../controllers/auth");
const grupoModel = require("../database/grupo");
const asignacionModel = require("../database/asignacion");

exports.signin = async (req, res) => {
    const {email, password} = req.body;
    const user = await authModel.signIn(email, password);
    if (user) {
        const tokenData = {
            id_usuario: user.id_usuario
        }

        const token = jwt.sign(tokenData, process.env.key, {
            expiresIn: 60 * 60 * 24 // expira en 24 horas
        });
        const usuario= {...user, token}
        delete usuario.contrasena
        res.send(usuario);
    } else {
        res.status(401).send({
            error: 'usuario o contraseña inválidos'
        });
        return;
    }
}

exports.verGrupos = (req, res) => {
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
    grupoModel.obtenerTodos(id_usuario, (error, result) => {
        if (error) {
            res.status(500).send({
                error: 'error inesperado'
            });
        } else {
            res.send(result);
        }
    });
}

exports.verAsignaciones = (req, res) => {
    const {id_grupo} = req.query;
    const token = req.headers['access-token'];
    const {id_usuario} = jwt.decode(token, process.env.key);
    grupoModel.obtenerPersona(id_grupo, id_usuario, (err, data) => {
        if (err) res.status(500).send({error: "error inesperado"});
        if (data.length > 0){
            const [{ permiso_id_permiso, color },] = data;
            asignacionModel.obtenerTodas(id_grupo, (error, asignaciones) => {
                if (error) res.status(500).send({error: "error inesperado"});
                res.send({asignaciones, color, permiso: permiso_id_permiso});
            });
        } else {
            res.send({message: "no perteneces a este grupo"});
        }
    });
}