const LocalStrategy = require("passport-local")
const model = require("../controllers/pagesc")

function initialize(passport){
    const authenticate = async (req, username, password, done) => {
        const user = await model.Inicio(username, password);
        if (user) {
            console.log("paso");
            req.session.id_usuario = user.id_usuario;
            req.session.nombre = user.nombre;
            req.session.imagen = user.imagen;
            return done(null, user);
        } else return done(null, false);
    }

    passport.serializeUser(function (user, done) {
        done(null, user.id_usuario);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user)
    });

    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, authenticate));
}

module.exports = initialize;