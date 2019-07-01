"use strict";

const express = require('express');
const router = express.Router();
const plugins = require('../plugins')

router.use(express.urlencoded());
router.use(express.json());

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/api/hello", (req, res) => {
    console.log(`-> GET ${req.path}`);
    res.send({ express: "Hello World" });
});

router.get("/api/validateqr", (req, res) => {
    console.log(`-> GET ${req.path}`);
    let idQR = req.query.id;
    //buscar en bd el id
    res.send({ express: "Hola aqui validamos el qr" });
});

router.post('/api/generateqr', (req, res) => {

    console.log(`-> POST ${req.path}`);

    var reqJsonBody = req.body;
    var data = JSON.stringify(reqJsonBody);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJsonBody);

    console.log(`-> The request data is:\n${data}\nid QR:${idQr}`);
    plugins.qr.qr_generate.generateQR(idQr, reqJsonBody);
    plugins.mail.mail_send.sendTheMail(idQr, reqJsonBody);

    res.json({
        ok: true
    });
});

module.exports = router;