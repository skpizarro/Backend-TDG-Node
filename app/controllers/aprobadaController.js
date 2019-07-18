const Pool = require('pg').Pool;
var url = require('url');
const config = require('../config');
const plugins = require('../plugins');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});

//post('/api/adm/approve', aprobadas.approve) 
//[body.dataUser]
exports.approve = function (req, res) {
    console.log(`\n-> POST (approve) ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    //idQr (si body.data no buscar bd, insert-delete) || buscar registro en BD sol_ing => data
    //insertar registro BD sol_aprb
    //eliminar registro BD sol_ing
    //enviar email w[idQr.image]
    //plugins.mail.mail_send.sendTheMail(idQr, reqJson);
    var data = JSON.stringify(reqJson);
    console.log('id: ' + reqJson.user.idQr);

    const queryText = 'INSERT INTO public.solicitud_aprobada(id_aprobada, id_usuario, nombre_usuario, email_usuario, tipo_usuario, fecha_visita, motivo_visita) values($1, $2, $3, $4, $5, $6, $7) returning *';
    const values = [
        reqJson.user.idQr,
        reqJson.user.cedula,
        reqJson.user.nombre + ' ' + reqJson.user.apellido,
        reqJson.user.email,
        reqJson.user.tipoPersona,
        reqJson.user.fecha,
        reqJson.user.motivoVisita];

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, values)
            .then(response => {
                release()
                eliminarRegistroSolicitud(reqJson.user.idQr);
                plugins.mail.mail_send.sendTheMail(reqJson.user.idQr, reqJson);
                console.log(`Success (201) Inserted ReqAprobada ${reqJson.user.idQr} * ${reqJson.user.nombre}`);
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

//get('/api/adm/aprobadas', aprobadas.findAll)
exports.findAll = function (req, res) {
    console.log(`\n-> GET---> findAll ${req.protocol}://${req.headers.host}${req.originalUrl} `); //${req.path} * ${req.originalUrl}
    const queryText = 'SELECT * FROM solicitud_aprobada';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText)
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not foundinformation ');
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) rows: ' + response.rowCount);
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

//get('/api/adm/aprobadas/:id', aprobadas.findOne)
exports.findOne = function (req, res) {
    console.log(`\n-> GET ---> findOne ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    var idQr = req.params.id;
    var queryText = 'SELECT * FROM solicitud_aprobada WHERE id_aprobada = $1';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idQr])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not found id: ' + idQr);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) ' + JSON.stringify(response.rows[0].id_aprobada + ' ' + response.rows[0].nombre_usuario));
                    res.status(200).send({
                        ok: true,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

//put('/api/adm/aprobadas/:id', aprobadas.update)
exports.update = function (req, res) {
    console.log(`\n-> POST --->update ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var idQr = req.params.id;
    var queryText = 'UPDATE solicitud_aprobada SET xxx = $1, yyyy = $2 WHERE id_aprobada = $3';
    return res.status(400).json({ ok: false, data: 'Not Implemented...' });
};

//delete('/api/adm/aprobadas/:id', aprobadas.delete)
exports.delete = function (req, res) {
    var idQr = req.params.id;
    var queryText = 'DELETE FROM solicitud_aprobada WHERE id_aprobada = $1 returning *';
    console.log(`\n-> DEL ---> delete: ${idQr} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idQr])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not deleted id: ' + idQr);
                    res.status(404).send({
                        ok: false,
                        message: 'Cann´t delete item with id: ' + idQr,
                    });
                } else {
                    console.log('Success (200) Item deleted id: ' + idQr);
                    res.status(200).send({
                        ok: true,
                        alert: 'Item deleted id: ' + idQr,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

function eliminarRegistroSolicitud(idQr) {
    var queryText = 'DELETE FROM solicitud_ingreso WHERE id_solicitud = $1 returning *';
    console.log(`\n-> DEL ---> delete from solicitudes NO APROBADAS: ${idQr} `);

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, ` + err);
        }
        client.query(queryText, [idQr])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error f.aprobadas Not deleted NA id: ' + idQr);
                } else {
                    console.log('Success f.aprobadas Item deleted NA id: ' + idQr);
                }
            })
            .catch(err => {
                console.log('error en query ' + queryText + ' -> ' + err);
            });
    });
};