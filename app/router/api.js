"use strict";

const express = require('express');
const router = express.Router();
const plugins = require('../plugins');
const dotenv = require("dotenv");
const { Client } = require('pg');
dotenv.config();

const MAIL_USER = process.env.MAIL_USER;
const POSTGRES_URI = process.env.POSTGRES_URI;

router.use(express.urlencoded());
router.use(express.json());

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/api/hello", (req, res) => {
    console.log(`\n-> GET ${req.path}`);
    res.send({ express: `ayuda:-> ${MAIL_USER}` });
});

router.get("/api/validateqr", (req, res) => {
    console.log(`-> GET ${req.path}`);
    let idQR = req.query.id;
    //buscar en bd el id
    res.send({ express: "Hola aqui validamos el qr" });
});

router.post('/api/generateqr', (req, res) => {

    console.log(`-> POST ${req.path}`);
    const client = new Client({
        connectionString: POSTGRES_URI,
        ssl: true,
    });

    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJson);
    console.log(`-> The request data is:\n${data}\nid QR:${idQr}`);

    const queryText = 'INSERT INTO public.solicitud_ingreso(id_solicitud, id_usuario, nombre_usuario, email_usuario, tipo_usuario, fecha_visita, motivo_visita) values($1, $2, $3, $4, $5, $6, $7)';
    const values = [idQr, reqJson.user.cedula, reqJson.user.nombre + ' ' + reqJson.user.apellido, reqJson.user.email, reqJson.user.tipoPersona, reqJson.user.fecha, reqJson.user.motivoVisita];

    client.connect((err, done) => {
        if (err) {
            done();
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, values)
            .then(response => {
                console.log('response length: ' + response.rows.length);
                client.end()
                plugins.qr.qr_generate.generateQR(idQr, reqJson);
                plugins.mail.mail_send.sendTheMail(idQr, reqJson);
                return res.status(200).send({
                    ok: true
                });
            })
            .catch(err => {
                client.end();
                console.log('error query insert not excecuted: ' + err);
                return res.status(500).send('Error, query insert not excecuted' + err);
            });
    });
});

router.get('/api/todos', (req, res, next) => {
    console.log(`-> GET ${req.path}`);
    const client = new Client({
        connectionString: POSTGRES_URI,
        ssl: true,
    })
    const queryText = 'SELECT * FROM solicitud_ingreso';

    client.connect((err, done) => {
        if (err) {
            done();
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText)
            .then(response => {
                if (response.rows.length < 1) {
                    client.end()
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No requests information found',
                    });
                } else {
                    client.end()
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                client.end()
                return res.status(500).json({ success: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
});

module.exports = router;