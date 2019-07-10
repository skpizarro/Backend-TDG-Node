/*
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" } 
console.log(JSON.stringify({ x: 5, y: 6 })); str->JSON
*/
const { Client } = require('pg');
const config = require('../config');
const plugins = require('../plugins');
const POSTGRES_URI = config.db_uri;

//'/api/solicitudes', solicitudes.approve
exports.approve = function(req, res) {
    console.log(`-> POST (approve) ${req.path}`);
    var reqJson = req.body;
    const client = new Client({
        connectionString: POSTGRES_URI,
        ssl: true,
    });
    //idQr --> buscar registro en BD sol_ing => data
    //insertar registro BD sol_aprb
    //eliminar registro BD sol_ing
    //enviar email w[idQr.image]
    //plugins.mail.mail_send.sendTheMail(idQr, reqJson);
    res.send("post Aprobar: \n");
};

//'/api/solicitudes', solicitudes.findAll
exports.findAll = function(req, res) {
    console.log("--->findAll\n");
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
                return res.status(400).json({ success: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

//'/api/solicitudes/:id', solicitudes.findOne
exports.findOne = function(req, res) {
    console.log("--->findOne \n");
    console.log(`-> GET ${req.path}`);
    var idQr = req.params.id;
    const client = new Client({
        connectionString: POSTGRES_URI,
        ssl: true,
    })

    //const queryText = `SELECT * FROM solicitud_ingreso WHERE id_solicitud = '${idQr}'`;
    var queryText = 'SELECT * FROM solicitud_ingreso WHERE id_solicitud = $1';
    var value = [idQr];
    client.connect((err, done) => {
        if (err) {
            done();
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, value)
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
                return res.status(400).json({ success: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};

//'/api/solicitudes/:id', solicitudes.update
exports.update = function(req, res) {
    console.log("--->update :\n");
    res.send("upft Actualizar: \n");
};

//'/api/solicitudes/:id', solicitudes.delete
exports.delete = function(req, res) {
    console.log("--->delete: \n");
    res.send("del Eliminar:\n");
};