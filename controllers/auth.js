const { request } = require("express");

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');
let fs = require('fs');
const multer = require('multer');


/*
let db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.pass,
    database: process.env.DB
});
*/

exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;
        
        if( !email || !password){
            return res.status(400).render('login', {
                message: 'Hay campos vacios'
            });
        }
        const db = mysql.createConnection({
            user: process.env.user,
            host: process.env.host,
            password: process.env.pass,
            database: process.env.DB
        });
        db.query('select * from usuario where email = ?', [email], async (error, results) =>{
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].contrasena))){
                res.status(401).render('login', {
                    message: 'Hay problemas con alguno de los campos'
                });
                
            }else{
                let id = results[0].id_usuario;
                
               const token = jwt.sign({ id }, process.env.JWT_SECRET , {
                    expiresIn: process.env.JWT_EXPIRESin
                });
               //console.log("la token es: "+ token);

                let cookieOptions = {
                    expires: new Date ( Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('Galletita', id, cookieOptions);
                req.session.user_id = id;



                res.status(200).redirect("/inicio")


            }
            db.end();
        });
        
    } catch(error){
        console.log(error);
    }
};



exports.imprime = (req,res) => {
    try{
    res.clearCookie("Galletita");
    //res.clearCookie("Galletita");
    console.log(req.cookies);
    res.status(200).redirect("/index");
        
    }catch(error){
        console.log(error);
    }
}


exports.register = (req, res) => {
    console.log(req.body);
    console.log(req.file + "---------------------");

    const {
        name, lastName, email, password, archivo
    } = req.body;
    try{
        const db = mysql.createConnection({
            user: process.env.user,
            host: process.env.host,
            password: process.env.pass,
            database: process.env.DB
        });
        db.query('select email from usuario where email = ?', [email], async (error, results) => {
            if (error){
                console.log(error);
            }
    
            if (results.length > 0){
                return res.render('register', {
                    message: 'Ese correo ya esta en uso'
                });
            }
    
            let crypPass = await bcrypt.hash(password, 5); 
            let imagen = 'nada aun';
            console.log(crypPass);
            
            let data = {
                title: req.body.nombre,
                creator: res.locals.nombre
            }
            
    
         
            db.query('insert into usuario set ?', { nombre: name, apellido:lastName , contrasena: crypPass ,email:email, imagen: imagen}, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    console.log(results);
                    return res.render('register', {
                        message: 'Usario registrado'
                    });
                }
            });
            db.end();
        });
    

    }catch(error){
        console.log(error);
    }
       

    //res.send("Formulario enviado");
}