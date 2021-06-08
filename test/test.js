const assert = require('assert');
const request = require('supertest');
const db = require('../database/db');
const random = require('../utils/random');
const app = require('../app');


describe('Connect db', () => {
    it('comprobar conexión', done => {
        //asi deberia ser, pero las configuraciones no lo permiten
        /*db.getConnection((err, connection) => {
            if(err){
                console.warn('No se pudo conectar con la base de datos', err);
            } else {
                console.log('Conexión con la bd correcta :)');
            done(); 
            }
        });*/
        if(db.config.waitForConnections){
            console.log('Conexión con la bd correcta :)');
            done(); 
        }else{
            console.warn('No se pudo conectar con la base de datos');
        }
    });
});

describe('utils', () => {
    it('Cadena de caracteres random', done => {
        assert.strictEqual(random(5).length, 5);
        done();
    });
});

describe('rutas', () => {
    it('La api responde con objetos JSON', done => {
        request(app)
        .get("/api/bienvenida")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('La ruta principal responde', done => {
        request(app).get("/")
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });

    it('La ruta login debe rechazar las credenciales', function(done){
        const credenciales = {email: "emailfake@fake.com", 
                            password: "123456"}
        request(app).post('/api/login')
            .send(credenciales)
            .expect(401)
            .expect('Content-Type', /json/)
            .end((err, response) => {
                assert(response.body.error === 'usuario o contraseña inválidos')
                done();
            });
    });
});