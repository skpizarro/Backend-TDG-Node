const Pool = require('pg').Pool;
var url = require('url');
const config = require('../config');
//const plugins = require('../plugins');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});

 
//'/api/solicitudes', solicitudes.findAll
exports.findAll = function(req, res) {
    console.log(`\n-> GET---> findAll ${req.protocol}://${req.headers.host}${req.originalUrl} `); //${req.path} * ${req.originalUrl}
    const queryText = 'SELECT * FROM solicitud_ingreso';

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

//'/api/solicitudes/:id', solicitudes.findOne
exports.findOne = function(req, res) {
    console.log(`\n-> GET ---> findOne ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    var idQr = req.params.id;
    var queryText = 'SELECT * FROM solicitud_ingreso WHERE id_solicitud = $1';

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
                    console.log('Success (200) ' + JSON.stringify(response.rows[0].id_solicitud + ' ' + response.rows[0].nombre_usuario));
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

//'/api/solicitudes/:id', solicitudes.update
exports.update = function(req, res) {
    console.log(`\n-> POST --->update ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    var idQr = req.params.id;
    var queryText = 'UPDATE solicitud_ingreso SET xxx = $1, yyyy = $2 WHERE id_solicitud = $3';

    /** 
     const id = parseInt(request.params.id)
     const { name, email } = request.body
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id]
    
    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ success: false, data: err });
        }
        client.query(queryText, [x, y, idQr])
        .then(response => {
            if (response.rowCount < 1) {
                    res.status(404).send({
                        ok: false,
                        message: 'Cann´t update item with id: ' + idQr,
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        alert: 'Item updated id: ' + idQr,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
        });*/
};

//'/api/solicitudes/:id', solicitudes.delete
exports.delete = function(req, res) {
    var idQr = req.params.id;
    var queryText = 'DELETE FROM solicitud_ingreso WHERE id_solicitud = $1 returning *';
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

// const fields = response.fields.map(field => field.name);
// console.log(fields);

// var resultt = new Array;
// data.forEach(row => {
//     resultt.push(`Id: ${row.id_solicitud}       Name: ${row.nombre_usuario}`);
// }
/*
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" } 
console.log(JSON.stringify({ x: 5, y: 6 })); str->JSON
*/