const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_user,
        pass: config.mail_password
    }
});

function sendTheMail(idQr, jsonEntrada) {

    console.log(`-> Enviando el email -> For ${jsonEntrada.user.email} -> From ${config.mail_user}`);

    let subjectTo = `QR Access - ${jsonEntrada.user.nombre} - id: ${idQr}`; //

    var mailOptions = {
        from: '"👻 Poli Access" <access.control.poli@gmail.com>',
        to: jsonEntrada.user.email,
        bcc: 'access.control.poli@gmail.com',
        subject: subjectTo,
        html: `<h1>Hola ${jsonEntrada.user.nombre},</h1>
            <h2>Este es tu codigo de ingreso a las granjas, es valido para la fecha: ${jsonEntrada.user.fecha}</h2>
            <br>
            <img src="https://qr-storage-poli.s3-sa-east-1.amazonaws.com/${idQr}.png" alt="Your QR Code" height="300" width="300" align="middle">
            <br>
            <h4>Recuerda almacenar el codigo y tenerlo a la mano para el acceso a las granjas unicamente el dia que es valido.</h4>`
    };

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