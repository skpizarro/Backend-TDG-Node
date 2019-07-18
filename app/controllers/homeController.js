const Pool = require('pg').Pool;
var url = require('url');
const config = require('../config');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});

//get'/api/hello'
exports.helloApi = function (req, res) {
    console.log(`\n-> GET --> hello ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    res.send({ express: `ayuda:-> ${config.mail_user}` });
};

//post('/api/login'
exports.loginAdmin = function (req, res) {
    console.log(`\n-> POST --> login ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    console.log("-REQ: " + reqJson.user.idUsuario);
    console.log("-stringfy: " + data);
    var idUsuario = reqJson.user.idUsuario
    var claveUsuario = reqJson.user.passwordUsuario
    // si este usuario y clave existen en bd_admin => ok? true : false
    var queryText = 'SELECT * FROM usuario_admin WHERE id_usuario = $1 and clave_usuario = $2';

    pool.connect((err, client, release) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idUsuario, claveUsuario])
            .then(response => {
                release()
                if (response.rowCount < 1) {
                    console.log('Error (404) NO ADMIN PASS ' + idUsuario);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) ADMIN PASS ' + idUsuario);
                    res.status(200).send({
                        ok: true,
                        user: "Hello user: " + idUsuario,
                        data: response.rows
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};