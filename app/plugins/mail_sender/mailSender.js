const nodemailer = require('nodemailer');
// const qr_id_gen = require('../index');

function sendTheMail(idQr, jsonEntrada) {

    console.log(`--------- enviando el email -------------- for ${jsonEntrada.user.email}`);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'access.control.poli@gmail.com',
            pass: 'politdgac2019'
        }
    });
    let subjectTo = `QR Access - ${jsonEntrada.user.nombre} - generate: ${idQr}`; //

    var mailOptions = {
        from: '"👻 Poli Access" <access.control.poli@gmail.com>',
        to: jsonEntrada.user.email, //, santiago_rios82131@elpoli.edu.co
        subject: subjectTo,
        //text: 'el texto o la imagen va aqui\n' + textoEnviar, // plain text body
        html: `<h1>Hola ${jsonEntrada.user.nombre}</h1>
            <br>
            <h3>Este es tu codigo de ingreso para la fecha ${jsonEntrada.user.fecha}</h3>
            <br>
            <img src="https://access-control-poli.herokuapp.com/static/${idQr}.png" alt="Your QR Code" height="42" width="42" align="middle">` // html body
            //<img src="http://localhost:8080/static/${idQr}.png" alt="Your QR Code" height="42" width="42" align="middle">` // html body
            //     ,
            // attachments: [{
            //         filename: 'notes.txt',
            //         content: 'Some notes about this e-mail',
            //         contentType: 'text/plain' // optional, would be detected from the filename
            //     },
            //     { // File Stream attachment
            //         filename: 'nyan cat ✔.gif',
            //         path: __dirname + '/assets/nyan.gif',
            //         cid: 'xxx@example.com' // should be as unique as possible
            //     }
            // ]
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