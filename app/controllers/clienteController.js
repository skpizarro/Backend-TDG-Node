const Pool = require('pg').Pool;
const config = require('../config');
const plugins = require('../plugins');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});

//get'/api/hello'
exports.helloApi = function(req, res) {
    console.log(`\n-> GET --> hello ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    res.send({ express: `ayuda:-> ${config.mail_user}` });
};

//post('/api/login'
exports.loginAdmin = function(req, res) {
    console.log(`\n-> POST --> login ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    // var data = JSON.stringify(reqJson)
    // reqJson.usuario.nombre
    // reqJson.usuario.password
    // si este usuario y clave existen en bd_admin => ok? true : false
    var queryText = 'SELECT * FROM usuario_admin WHERE identificacion = $1';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, [idQr])
            .then(response => {
                release()
                if (response.rows.length < 1) {
                    console.log('Error (404) NO PASS ' + idUsuario);
                    res.status(404).send({
                        status: 'Failed',
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) ADMIN PASS ' + idUsuario);
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
    res.send('hello admin:');
};

//get'/api/validateqr/:id'
exports.validateRequest = function(req, res) {
    console.log(`\n-> GET ---> validateOne ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    var idQr = req.params.id;
    var queryText = 'SELECT * FROM solicitud_ingreso WHERE id_solicitud = $1';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, [idQr])
            .then(response => {
                release()
                var idUsuario = JSON.stringify(response.rows[0].id_usuario);
                var nombreUsuario = JSON.stringify(response.rows[0].nombre_usuario);
                var fechaVisita = JSON.stringify(response.rows[0].fecha_visita);

                fechaVisita = plugins.qr.qr_id_generate.cleanDate(fechaVisita);
                fechaActual = plugins.qr.qr_id_generate.generateCleanDateOnly();

                console.log(`**data \n*id: ${idUsuario} *name: ${nombreUsuario} *in_date: ${fechaVisita} *curr_date: ${fechaActual} *rowCount: ${response.rowCount}`);

                if (response.rowCount < 1 || fechaActual !== fechaVisita) {
                    console.log('Error (404) USER NO PASS ' + idUsuario);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found or Date error: ' + fechaVisita + ' T: ' + fechaActual,
                    });
                } else {
                    console.log('Success (200) USER PASS ' + nombreUsuario);
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query o usuario no existe ' + queryText + ' -> ' + err });
            });
    });
};

//POST'/api/generateqr'
exports.createRequest = function(req, res) {
    console.log(`\n-> POST --> generate ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJson);

    console.log(`-> The request data id QR: ${idQr}`);

    const queryText = 'INSERT INTO public.solicitud_ingreso(id_solicitud, id_usuario, nombre_usuario, email_usuario, tipo_usuario, fecha_visita, motivo_visita) values($1, $2, $3, $4, $5, $6, $7) returning *';
    const values = [idQr, reqJson.user.cedula, reqJson.user.nombre + ' ' + reqJson.user.apellido, reqJson.user.email, reqJson.user.tipoPersona, reqJson.user.fecha, reqJson.user.motivoVisita];

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, values)
            .then(response => {
                release()
                plugins.qr.qr_generate.generateQR(idQr, reqJson);
                plugins.mail.mail_send.sendTheMail(idQr, reqJson);
                console.log(`Success (201) Inserted ${idQr} * ${reqJson.user.nombre}`);
                return res.status(201).send({
                    ok: true,
                    data: response.rows
                });
            })
            .catch(err => {
                console.log('error query insert not excecuted: ' + err);
                return res.status(400).send({ ok: false, data: err });
            });
    });

};