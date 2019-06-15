const nodemailer = require('nodemailer');

function sendTheMail(textoEnviar, jsonEntrada) {

    console.log('ENVIANDO EL EMAIL');

    let subjectTo = `QR my dear ${jsonEntrada.nombre} + ${new Date()} `

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
        from: '"👻 Poli Access Control" <access.control.poli@gmail.com>', // sender address
        to: "cristian_garces82121@elpoli.edu.co, cgaop7@gmail.com", // list of receivers
        subject: subjectTo, //"-- Hello ✔",  Subject line
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

    transporter.sendMail(mailOptions, function(error, info) {
        console.log("senMail returned!");
        if (error) {
            console.log("ERROR!!!!!!", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendTheMail
}