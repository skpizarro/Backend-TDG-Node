const nodemailer = require('nodemailer');

function sendTheMail(textoEnviar, jsonEntrada) {

    console.log(`--------- enviando el email -------------- for ${jsonEntrada.nombre}`);

    let subjectTo = `QR Poli Access - ${jsonEntrada.nombre} - generate: ${new Date().toISOString()} (ServerTimeZone)`; //
    //

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true, // true for 465, false for other ports
        auth: {
            user: 'access.control.poli@gmail.com',
            pass: 'politdgac2019'
        }
    });

    var mailOptions = {
        from: '"👻 Poli Access Control" <access.control.poli@gmail.com>',
        to: "cristian_garces82121@elpoli.edu.co, santiago_rios82131@elpoli.edu.co", //
        subject: subjectTo,
        text: 'el texto o la imagen va aqui\n' + textoEnviar, // plain text body
        //html: "<b>Hello world-----?</b>" // html body
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