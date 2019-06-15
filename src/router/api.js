"use strict";

const express = require('express');
const qr = require('qr-image');
const router = express.Router();
var fs = require('fs');

router.use(express.urlencoded());
router.use(express.json());

router.get("/api/hello", (req, res) => {
    res.send({ express: "Denne meldingen kommer fra Express.js backend" });
});

router.post('/api/users', (req, res) => {

    console.log(`request -> POST ${req.path} + hosst que hace la peticion... ${req.hostname}`);
    // var data = req.body;
    var data = JSON.stringify(req.body);
    console.log(`The data extract is: ${data} `);

    var code = qr.image(data, { type: 'png', size: 8, margin: 3, });
    var output = fs.createWriteStream('../src/img/' + Date.now() + '.png')
    code.pipe(output);

    //que debo responder al front....
    res.status(200).json({
        ok: true,
        mensaje: 'Usuario creado en BD',
        datos: data
    });
});

module.exports = router;