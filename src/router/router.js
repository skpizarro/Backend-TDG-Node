"use strict";

const express = require('express');
const qr = require('qr-image');
const router = express.Router();
var fs = require('fs');

/*
var qr_png = qr.image('I love QR!', { type: 'svg' });
qr_png.pipe(require('fs').createWriteStream('i_love_qr.svg'));

var svg_string = qr.imageSync('I love QR!', { type: 'svg' });
----------------------------------

var code = qr.image('http://blog.nodejitsu.com', { type: 'svg' });  
var output = fs.createWriteStream('nodejitsu.svg')

code.pipe(output);  

*/
router.use(express.urlencoded());
router.use(express.json());

router.get("/api/hello", (req, res) => {
    res.send({ express: "Denne meldingen kommer fra Express.js backend" });
});

router.get('/api/generateqr', (req, res) => {
    //recibo query params $correo=true || $correo=false
    let body = req.body;
    let sendMail = req.query.correo || false;
    sendMail = Boolean(sendMail);

    if (sendMail) {
        //MyMethods.sendMailTo(req.body.email, qrimage)
    }

    console.log(`request -> GET ${req.path}`);
    const user = req.body;//.name.....
    // if (err) {
    //     console.log(`Error GET ./  _:` + err);
    //     res.json({
    //         ok: false,
    //         mensaje: 'Vamos mal!!'
    //     })
    // }

    //recibir data del formulario (json)

    //generarQR

    //recibir parametro en el path /api/generateqr $correo = 

    //if(true)->(enviarQRemail)

    //if(false)->(exponerQRdownload)

    //RES.CREADO,RES.NOCREADO

    res.status(200).json({
        ok: true,
        mensaje: 'Vamos bien!!',
        usuario: user
    });
});

router.get('/api/validateqr', (req, res) => {

    console.log(`request -> GET ${req.path}`);

    // recibir data del QR
    // consultar #QR, documento
    // si QR.valido (por fecha) RES.OK
    // si QR.invalido (por fecha o documento) RES.FALSE

    res.status(200).json({
        ok: true,
        mensaje: 'Vamos bien!!'
    });
});

router.post('/api/users', (req, res) => {

    console.log(`request -> POST ${req.path} + hosst que hace la peticion... ${req.hostname}`);
    // var data = req.body;
    var data = JSON.stringify(req.body);
    console.log(`The data extract is: ${data} `);

    var code = qr.image(data, { type: 'png' });
    var output = fs.createWriteStream('../src/img/qrtest.png')

    code.pipe(output);

    res.status(200).json({
        ok: true,
        mensaje: 'Vamos mal!!',
        datos: data
    });
});

module.exports = router;