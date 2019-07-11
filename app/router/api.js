const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const plugins = require('../plugins');
const config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.get("/api/hello", (req, res) => {
    console.log(`\n-> GET ${req.path}`);
    res.send({ express: `ayuda:-> ${config.mail_user}` });
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
        connectionString: config.db_uri,
        ssl: true,
    });

    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJson);
    console.log(`-> The request data is:\n${data}\nid QR:${idQr}`);

    const queryText = 'INSERT INTO public.solicitud_ingreso(id_solicitud, id_usuario, nombre_usuario, email_usuario, tipo_usuario, fecha_visita, motivo_visita) values($1, $2, $3, $4, $5, $6, $7) returning *';
    const values = [idQr, reqJson.user.cedula, reqJson.user.nombre + ' ' + reqJson.user.apellido, reqJson.user.email, reqJson.user.tipoPersona, reqJson.user.fecha, reqJson.user.motivoVisita];

    client.connect((err, done) => {
        if (err) {
            done();
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, values)
            .then(response => {
                client.end()
                    //plugins.qr.qr_generate.generateQR(idQr, reqJson);
                    //plugins.mail.mail_send.sendTheMail(idQr, reqJson);
                console.log('insertado');
                return res.status(201).send({
                    ok: true,
                    data: response.rows
                });
            })
            .catch(err => {
                client.end();
                console.log('error query insert not excecuted: ' + err);
                return res.status(400).send('Error, query insert not excecuted' + err);
            });
    });
});

module.exports = router;
/**
 *  bodyParser.urlencoded(): analiza el texto como datos codificados en URL 
 * (enviar datos de formularios normales establecidos a POST) 
 * y expone el objeto resultante (con las claves y los valores) en req.body.
 * 
 *  bodyParser.json(): Analiza el texto como JSON 
 * y expone el objeto resultante en req.body.
 */