const Pool = require('pg').Pool;
var url = require('url');
const config = require('../config');
const Protocolo = require('./protocoloSolicitud');

const confDb = {
    connectionString: 'postgressql://postgres:superuser@localhost:5432/protocolo_zonas_granja'
}


const pool = new Pool(confDb);

//get'/api/hello'
exports.helloApi = function(req, res) {
    console.log(`\n-> GET --> hello ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    res.send({ express: `ayuda:-> ${config.mail_user}` });
};

//get('/api/Formulario')
exports.formulario = function(req, res) {
    console.log(`\n-> GET --> hello ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    pool.connect((err, client,release) => {
        if(err){
            res.status(500).send({
                ok: false,
                data:err
            })
        }
            Protocolo.getTipoUsuario(client).then(respuesta =>{
                client.release();
                if(respuesta.rows.length > 0){
                    console.log(respuesta.rows);
                    res.status(200).send({
                        ok:true,
                        data:respuesta.rows})
                }else{
                    res.status(400).send({
                        ok:false,
                        data:"Error al consultar tipo usuario"})
                }   
            }).catch(e => {
                res.status(400).send({
                    ok:false,
                    data:"Error"})
            })
    })
}

exports.zonasxFechaForm = function(req, res) {
    console.log(`\n-> GET --> hello ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    const {fecha} = req.query;
    console.log(fecha);
    pool.connect((err, client) => {
        if(err){
            res.status(500).send({
                ok: false,
                data:err
            })
        }
        
            Protocolo.getZonaDispxfecha(client,fecha).then(respuesta =>{
                client.release();
                console.log("respuesta ",respuesta)
                if(respuesta.length > 0){
                    res.status(200).send({
                        ok:true,
                        data:respuesta})
                }else{

                    res.status(400).send({
                        ok:false,
                        data:"Error al consultar zonas por fecha ",fecha})
                }
                    
            }).catch(e => {
                res.status(400).send({
                    ok:false,
                    data:"Error"})
            })
                

    })
}




//post('/api/login'
exports.loginAdmin = function(req, res) {
    console.log(`\n-> POST --> login ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
    var data = JSON.stringify(reqJson);
    console.log("-REQ: " + reqJson.user.idAdmin);
    console.log("-stringfy: " + data);
    var idAdmin = reqJson.user.idAdmin
    var claveAdmin = reqJson.user.passwordAdmin
        
    var queryText = 'SELECT * FROM administrador WHERE id_administrador= $1 AND clave_administrador = $2'
    pool.connect((err, client) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText, [idAdmin, claveAdmin])
            .then(response => {
                client.release();
                if (response.rowCount < 1) {
                    console.log('Error (404) NO ADMIN PASS ' + idAdmin);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found',
                    });
                } else {
                    console.log('Success (200) ADMIN PASS ' + idAdmin);
                    res.status(200).send({
                        ok: true,
                        admin:idAdmin
                    });
                }
            })
            .catch(err => {
                return res.status(400).json({ ok: false, data: 'error en query ' + queryText + ' -> ' + err });
            });
    });
};