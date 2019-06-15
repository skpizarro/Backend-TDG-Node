"use strict";

const express = require('express');
// const qr = require('qr-image');
const router = express.Router();
const plugins = require('../plugins')
    // var fs = require('fs');

router.use(express.urlencoded());
router.use(express.json());

router.get("/api/hello", (req, res) => {
    res.send({ express: "Denne meldingen kommer fra Express.js backend" });
});

router.post('/api/users', (req, res) => {

    console.log(`request -> POST ${req.path} + hosst que hace la peticion... ${req.hostname}`);
    var jsonBody = req.body;
    var data = JSON.stringify(jsonBody);
    console.log(`The data extract is: ${data} `);

    plugins.qr.qr_generate.generateQR(data, jsonBody);
    plugins.mail.mail_send.sendTheMail(data, jsonBody);

    //que debo responder al front....
    res.status(200).json({
        ok: true,
        mensaje: 'Usuario creado en BD',
        datos: data
    });
});

module.exports = router;