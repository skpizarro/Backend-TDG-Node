const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_USER = process.env.MAIL_USER;

// const path = require("path");
// var configPath = path.join(process.cwd(), '../app/config');
// if (process.env.NODE_ENV === 'production') {
//     configPath = path.join(process.cwd(), './app/config');
// }
// const config = require(configPath);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
});

function sendTheMail(idQr, jsonEntrada) {

    console.log(`-> Enviando el email -> for ${jsonEntrada.user.email} -> from ${MAIL_USER}`);

    let subjectTo = `QR Access - ${jsonEntrada.user.nombre} - id: ${idQr}`; //

    var mailOptions = {
        from: '"👻 Poli Access" <access.control.poli@gmail.com>',
        to: jsonEntrada.user.email,
        subject: subjectTo,
        html: `<h1>Hola ${jsonEntrada.user.nombre}</h1>
            <br>
            <h3>Este es tu codigo de ingreso a las granjas, es valido para la fecha: ${jsonEntrada.user.fecha}</h3>
            <br>
            <img src="https://qr-storage-poli.s3-sa-east-1.amazonaws.com/${idQr}.png" alt="Your QR Code" height="300" width="300" align="middle">` // html
    };

    try {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("Error mail sending !", error);
            } else {
                console.log('- Email sent:' + info.response);
            }
        });
    } catch (e) {
        console.log("ERROR sending email:" + e);
    }
}

module.exports = {
    sendTheMail
}