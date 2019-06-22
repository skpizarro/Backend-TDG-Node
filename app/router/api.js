"use strict";
const express = require('express');
const router = express.Router();
const plugins = require('../plugins')
    //const qr = require('qr-image');

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
    console.log(`-> The request data is: \n${data} `);

    // var code = qr.image(data, { type: 'png', size: 6, margin: 3, });
    // res.writeHead(200, { 'Content-Type': 'image/png' });
    // code.pipe(res);

    plugins.qr.qr_generate.generateQR(data, reqJsonBody);
    //plugins.mail.mail_send.sendTheMail(data, reqJsonBody);

    //que debo responder al front....
    //res.status(200).sendFile('/uploads/' + uid + '/' + file);
    res.json({
        ok: true
    });

});

module.exports = router;