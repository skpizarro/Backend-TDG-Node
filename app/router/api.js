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
    res.send({ express: "Hello papi" });
});

router.post('/api/generateqr', (req, res) => {

    console.log(`-> POST ${req.path}\nREQUEST HOST ${req.hostname}`);

    var reqJsonBody = req.body;
    var data = JSON.stringify(reqJsonBody);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJsonBody);

    console.log(`-> The request data is: \n${data}\n${idQr}`);

    plugins.qr.qr_generate.generateQR(idQr, reqJsonBody);
    plugins.mail.mail_send.sendTheMail(idQr, reqJsonBody);

    res.json({
        ok: true
    });

});

module.exports = router;