const Pool = require('pg').Pool;
const config = require('../config');
const plugins = require('../plugins');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
});

//get'/api/hello'
exports.helloApi = function(req, res) {
    console.log(`\n-> GET ${req.path}`);
    res.send({ express: `ayuda:-> ${config.mail_user}` });
};

//get'/api/validateqr/:id'
exports.validateRequest = function(req, res) {
    console.log(`-> GET ${req.path}`);
    console.log(`--->validateOne\n-> GET ${req.path} \n`);

    var idQr = req.params.id;
    var queryText = 'SELECT * FROM solicitud_ingreso WHERE id_solicitud = $1';

    pool.connect((err) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        pool.query(queryText, [idQr])
            .then(response => {
                var idUsuario = JSON.stringify(response.rows[0].id_usuario);
                var nombreUsuario = JSON.stringify(response.rows[0].nombre_usuario);
                var fechaVisita = JSON.stringify(response.rows[0].fecha_visita);

                fechaVisita = plugins.qr.qr_id_generate.cleanDate(fechaVisita);
                fechaActual = plugins.qr.qr_id_generate.generateCleanDateOnly();

                console.log(`data \nid: ${idUsuario} name: ${nombreUsuario}\nin_date ${fechaVisita} curr_date ${fechaActual}\nrowCount: ${response.rowCount}`);

                if (response.rowCount < 1 || fechaActual !== fechaVisita) {
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No requests information found or Date error ' + fechaVisita,
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ success: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

//POST'/api/generateqr'
exports.createRequest = function(req, res) {
    console.log(`-> POST ${req.path}`);
    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJson);

    console.log(`-> The request data is:\n${data}\nid QR:${idQr}`);

    const queryText = 'INSERT INTO public.solicitud_ingreso(id_solicitud, id_usuario, nombre_usuario, email_usuario, tipo_usuario, fecha_visita, motivo_visita) values($1, $2, $3, $4, $5, $6, $7) returning *';
    const values = [idQr, reqJson.user.cedula, reqJson.user.nombre + ' ' + reqJson.user.apellido, reqJson.user.email, reqJson.user.tipoPersona, reqJson.user.fecha, reqJson.user.motivoVisita];

    pool.connect((err) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        pool.query(queryText, values)
            .then(response => {
                //plugins.qr.qr_generate.generateQR(idQr, reqJson);
                //plugins.mail.mail_send.sendTheMail(idQr, reqJson);
                console.log('insertado');
                return res.status(201).send({
                    ok: true,
                    data: response.rows
                });
            })
            .catch(err => {
                console.log('error query insert not excecuted: ' + err);
                return res.status(400).send('Error, query insert not excecuted' + err);
            });
    });
};