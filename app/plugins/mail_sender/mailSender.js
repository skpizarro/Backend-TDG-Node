const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_user,
        pass: config.mail_password
    }
});

function sendTheMail(idQr,jsonEntrada,value,qrZones) {
    const {nombre_usuario,
            email_usuario,
            fecha_visita,
            id_solicitud,
            observaciones} = jsonEntrada;

    console.log(`-> Enviando el email -> For ${email_usuario} -> From ${config.mail_user}`);

    if(value ==="Accepted"){
        //Solicitud Aceptada
        let subjectTo = `QR Access - ${nombre_usuario} - id: ${idQr}`;
        var mailOptions = {
        from: '"👻 Granja Román Gómez Poli JIC" <granjarggpolijic@gmail.com>',
        to: email_usuario,
        bcc: 'granjarggpolijic@gmail.com',
        subject: subjectTo,
        attachDataUrls: true, // para aceptar contenido base64
        html: `<h1>Hola ${nombre_usuario},</h1>
            <p>Este es tu codigo de ingreso a las granjas, es valido para la fecha: ${fecha_visita}</p>
            <br>
            <img src="${qrZones.qr}" alt="Tu codigo QR" height="300" width="300" align="middle"/>
            <p>Codigo valido para ingresar a las zonas: ${qrZones.zones} </p>
            <h3>Observaciones</h3>
            <p>${observaciones}</p>
            <h4>Recuerda almacenar el codigo y tenerlo a la mano para el acceso a la granja y sus zonas unicamente el dia que es valido.</h4>`
        };
    }else if(value ==="Rejected"){
        //Solicitud Rechazada
        let subjectTo = `Request Denied - ${nombre_usuario} - id: ${id_solicitud}`;
        var mailOptions = {
        from: '"👻 Granja Román Gómez Poli JIC" <granjarggpolijic@gmail.com>',
        to: email_usuario,
        bcc: 'granjarggpolijic@gmail.com',
        subject: subjectTo,
        html: `<h1>Hola ${nombre_usuario},</h1>
            <h2>Sentimos informarle que su solicitud ha sido rechazada</h2>
            <h3>Observaciones</h3>
            <h4>${observaciones}</h4>
            `
        };
    }else if(value==="Special Permission"){
        //Permiso especial
        let subjectTo = `QR Access - ${nombre_usuario} - id: ${idQr}`;
        var mailOptions = {
        from: '"👻 Granja Román Gómez Poli JIC" <granjarggpolijic@gmail.com>',
        to: email_usuario,
        bcc: 'granjarggpolijic@gmail.com',
        subject: subjectTo,
        attachDataUrls: true, // para aceptar contenido base64
        html: `<h1>Hola ${nombre_usuario},</h1>
            <p>Este es tu codigo con permiso especial para ingreso a las granjas, es valido hasta nueva orden</p>
            <br>
            <img src="${qrZones.qr}" alt="Tu codigo QR" height="300" width="300" align="middle"/>
            <p>Codigo valido para ingresar a las zonas: ${qrZones.zones} </p>
            <h3>Observaciones</h3>
            <p>${observaciones}</p>
            <h4>Recuerda almacenar el codigo y tenerlo a la mano para el acceso a la granja y sus zonas.</h4>`
        };
    }else{
        //Permiso anulado
        let subjectTo = `Request Canceled - ${nombre_usuario} - id: ${id_solicitud}`;
        var mailOptions = {
        from: '"👻 Granja Román Gómez Poli JIC" <granjarggpolijic@gmail.com>',
        to: email_usuario,
        bcc: 'granjarggpolijic@gmail.com',
        subject: subjectTo,
        html: `<h1>Hola ${nombre_usuario},</h1>
            <h2>Sus permisos de ingreso han sido anulados, por lo que el codigo QR de ingreso no es valido actualmente</h2>
            <h3>Observaciones</h3>
            <h4>${observaciones}</h4>
            `
        };
    }
    
    try {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("Error mail sending !", error);
            } else {
                console.log('-Email sent:' + info.response + '-');
            }
        });
    } catch (e) {
        console.log("ERROR sending email:" + e);
    }
}

module.exports = {
    sendTheMail
};