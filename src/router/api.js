"use strict";

const express = require('express');
const router = express.Router();
const plugins = require('../plugins')

router.use(express.urlencoded());
router.use(express.json());

router.get("/api/hello", (req, res) => {
    res.send({ express: "Hello mmgv" });
});

router.post('/api/users', (req, res) => {

    console.log(`-> POST ${req.path}\nREQUEST HOST ${req.hostname}`);
    // necesito desde el front enviar en la query $correo = true or false
    //var send_mail = req.params.correo;
    var jsonBody = req.body;
    var data = JSON.stringify(jsonBody);
    console.log(`The request data is: \n${data} `);

    plugins.qr.qr_generate.generateQR(data, jsonBody);
    plugins.mail.mail_send.sendTheMail(data, jsonBody);

    /*    
    if(send_mail){
        plugins.mail.mail_send.sendTheMail(data, jsonBody);
    }
    */

    //que debo responder al front....
    res.status(200).json({
        ok: true,
        mensaje: 'Usuario creado en BD',
        //datos: data,
        dataJson: jsonBody
    });
});

module.exports = router;