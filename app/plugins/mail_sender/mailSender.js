const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER || 'access.control.poli@gmail.com',
        pass: process.env.MAIL_PASS || 'politdgac2019'
    }
});

function sendTheMail(idQr, jsonEntrada) {

    console.log(`--------- enviando el email -------------- for ${jsonEntrada.user.email}`);

    let subjectTo = `QR Access - ${jsonEntrada.user.nombre} - generate: ${idQr}`; //

    var mailOptions = {
        from: '"👻 Poli Access" <access.control.poli@gmail.com>',
        to: jsonEntrada.user.email, //, santiago_rios82131@elpoli.edu.co
        subject: subjectTo,
        html: `<h1>Hola ${jsonEntrada.user.nombre}</h1>
            <br>
            <h3>Este es tu codigo de ingreso a las granjas para la fecha ${jsonEntrada.user.fecha}</h3>
            <br>
            <img src="https://qr-storage-poli.s3-sa-east-1.amazonaws.com/${idQr}.png" alt="Your QR Code" height="300" width="300" align="middle">` // html
    };

    try {

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("Error mail sending !", error);
            } else {
                console.log('- Email sent: >' + info.response + '<');
            }
        });

    } catch (e) {
        console.log("ERROR enviando email--" + e);
    }
}

module.exports = {
    sendTheMail
}