const nodemailer = require('nodemailer');

const Mail = function(mail){
    this.nombre = mail.nombre;
    this.email = mail.email;
    this.error = mail.id_problema;
    this.fecha = mail.fecha;
    this.message = 
    `<h1>Nuevo reporte de error del ${this.fecha}</h1>
    <ul>
        <li><b>Nombre:</b> ${this.nombre} </li>
        <li><b>Correo Electronico:</b> ${this.email}</li>
        <li><b>Codigó de error:</b> ${this.error}
        <li><b>Mensaje:</b> ${mail.descripcion}</li>
    </ul>`;
    
    this.asunto = `Nuevo reporte de error - ${this.error} - ${this.fecha}`;
}

Mail.sendEmail = (newMail) => {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail.com',
        port: 465,
        secure: false,
        ignoreTLS: true,
        auth: {
            user: 'nocqueponer54@gmail.com',
            pass: 'nocqueponer3000'
        }
    });

    // Definimos el email
    const mailOptions2 = {
        from: 'nocqueponer54@gmail.com',
        to: newMail.email,
        subject: newMail.asunto,
        html: newMail.message
    };

    const mailOptions = {
        from: 'nocqueponer54@gmail.com',
        to: 'projectswakeup@gmail.com',
        subject: newMail.asunto,
        html: newMail.message
    };

    //Verificamos que las configuraciones funcionen
    transporter.verify((err, success) => {
        if (err) console.error(err);
        else console.log('La configuracion del correo es correcta :)');
    });

    // Enviamos el email al admin
    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            console.log(error);
        } else {
            console.log("Email Enviado :)");
            //console.log(info);
        }
    });

    //enviamos el email al usuario
    transporter.sendMail(mailOptions2, (error, info) => {
        if (error){
            console.log(error);
        } else {
            console.log("Email Enviado :)");
            //console.log(info);
        }
    });
}

module.exports = Mail;
