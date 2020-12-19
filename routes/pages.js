const { render } = require('ejs');
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const connection = require ('../database/db');



const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { end } = require('../database/db');



/*
const db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.pass,
    database: process.env.DB
});
*/

const router = express.Router();
router.get('/',(req, res) => {

        

        console.log(req.cookies.Galletita);
        console.log(req.session.user_id);

        if(!(req.cookies.Galletita)){

            res.render('index');
        }else{
            try{
                const db = mysql.createConnection({
                    user: process.env.user,
                    host: process.env.host,
                    password: process.env.pass,
                    database: process.env.DB
                });
                db.query('select * from usuario where id_usuario =? ', [req.cookies.Galletita] , async (error, results) => {
                    if (error){
                    console.log(error);
                    }else{
                    return res.render('inicio', {
                        nombre: results[0].nombre,
                        apellido: results[0].apellido,
                        email: results[0].email,
                        foto: results[0].imagen
                    });
                    }
                    db.end();
                });
                db.end();
            }catch(error){
                console.log(error);
            }
            
        }
            
   

});

router.get('/register',(req, res) => {


    if(!(req.cookies.Galletita)){
        res.render('register');
  
       // res.render('inicio');
    }else{
        res.redirect("/")
    }
    
   


});
router.get('/login',(req, res) => {
    
    if(!(req.cookies.Galletita)){
        res.render('login');
  
       // res.render('inicio');
    }else{
        res.redirect("/")
    }



    
   
        
    

});

router.get('/inicio',(req, res) => {

    if(req.cookies.Galletita){

        try{
            const db = mysql.createConnection({
                user: process.env.user,
                host: process.env.host,
                password: process.env.pass,
                database: process.env.DB
            });
                
            connection.query('select * from usuario where id_usuario =? ', [req.cookies.Galletita] , async (error, results) => {
                if (error){
                console.log(error);
                }else{
                return res.render('inicio', {
                    nombre: results[0].nombre,
                    apellido: results[0].apellido,
                    email: results[0].email,
                    foto: results[0].imagen
                });
                }
                db.end();
            });
            
        }catch(error){
            console.log(error);
        }
      
  
       // res.render('inicio');
    }else{
        res.redirect("/")
    }
    
            
     
    
});

router.get('/logout', (req,res) =>{
    


    let cookieOptions = {
        expires: new Date ( Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 0 * 1000),
        httpOnly: true
    }
    res.cookie('Galletita', 0, cookieOptions);
   
    res.redirect("/")

    //req.cookie.Galletita.set('Galletita', {expires: new Date(0)});

  
   
});

module.exports = router;