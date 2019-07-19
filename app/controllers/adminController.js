const Pool = require('pg').Pool;
const config = require('../config');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});
 
//post('/admin/crud', adminController.create);
exports.create = function (req, res) {
    console.log(`\n-> POST (create) ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;

    const queryText = 'INSERT INTO public.usuario_admin(id_usuario, nombre_usuario, clave_usuario) values($1, $2, $3) returning *';
    const values = [reqJson.user.idUsuario,
        reqJson.user.nombresUsuario,
        reqJson.user.passwordUsuario];

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, values)
            .then(response => {
                release()
                console.log(`Success (201) Inserted admin ${reqJson.user.idUsuario} * ${reqJson.user.nombresUsuario}`);
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

//get('/admin/crud', adminController.findAll);
exports.findAll = function (req, res) {
    console.log(`\n-> GET---> findAll ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    const queryText = 'SELECT * FROM usuario_admin';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText)
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not found information ');
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

//get('/admin/crud/:id', adminController.findOne)
exports.findOne = function (req, res) {
    console.log(`\n-> GET ---> findOne ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    var idAdmin = req.params.id;
    var queryText = 'SELECT * FROM usuario_admin WHERE id_usuario = $1';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idAdmin])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not found id: ' + idAdmin);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) ' + JSON.stringify(response.rows[0].id_usuario + ' ' + response.rows[0].nombre_usuario));
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

//put('/admin/crud', adminController.update);
exports.update = function (req, res) {
    console.log(`\n-> PUT --->update ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    //var queryText = 'UPDATE usuario_admin SET xxx = $1, yyyy = $2 WHERE id_usuario = $3';
    return res.status(400).json({ ok: false, data: 'Not Implemented...' });
};

//delete('/admin/crud/:id', adminController.delete); 
exports.delete = function (req, res) {
    var idAdm = req.params.id;
    var queryText = 'DELETE FROM usuario_admin WHERE id_usuario = $1 returning *';
    console.log(`\n-> DEL ---> delete: ${idAdm} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idAdm])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) Not deleted id: ' + idAdm);
                    res.status(404).send({
                        ok: false,
                        message: 'Cann´t delete item with id: ' + idAdm,
                    });
                } else {
                    console.log('Success (200) Item deleted id: ' + idAdm);
                    res.status(200).send({
                        ok: true,
                        alert: 'Item deleted id: ' + idAdm,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};
