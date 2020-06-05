const Pool = require('pg').Pool;
var url = require('url');
const config = require('../config');
const plugins = require('../plugins')
const protocolo = require('./protocoloSolicitud');

const pool = new Pool({
    connectionString: config.db_uri,
    ssl: true,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});
 
exports.getZonas =function(req,res){
    console.log(`\n-> GET---> getZonas ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    const queryText = "SELECT * FROM zona";
    pool.connect((err,client)=>{
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }

        client.query(queryText)
            .then(response => {
                client.release();
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
    })
}

//'/api/solicitudes', solicitudes.findAll
exports.findAll = function(req, res) {
    console.log(`\n-> GET---> findAll ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    //Consultamos todas la solicitudes que estan pendientes
    const queryText = `
                        SELECT
                        si.id_solicitud,
                        si.id_usuario,
                        si.motivo_Visita,
                        si.fecha_visita,
                        u.nombre_usuario,
                        u.apellido_usuario,
                        u.email_usuario,
                        tu.tipo_usuario
                        FROM solicitud_ingreso AS si 
                        JOIN usuario AS u ON si.id_usuario = u.id_usuario
                        JOIN tipo_usuario AS tu ON u.id_tipo_usuario = tu.id_tipo_usuario
                        WHERE si.estado = 'Pendiente'
                    `
    pool.connect((err, client) => {
        if (err) {
            console.log(`error conectando db, path: ${req.path} ` + err);
            return res.status(500).json({ ok: false, data: err });
        }
        client.query(queryText)
            .then(response => {
                client.release();
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
                client.release();
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

};




//Denegar completamente la entrada a cada una de las zonas
//'/api/solicitudes/
exports.deny = async(req, res) =>{
    try{
        const reqJson = req.body.dataUser;
        const {id_solicitud,zonasSolicitadas,fecha_visita,authAdmin} = reqJson;
        
        //Creamos un array con todas las zonas y una propiedad permiso con valor denegado para todas
        const deniZones = zonasSolicitadas.map(({id_zona,nombre_zona})=>{return {id_zona,nombre_zona,permiso:'Denied'} });
        //var idQr = req.params.id;
        //Se rechaza la solicitud
        const response = await protocolo.updateSolicitudState('Rejected',id_solicitud,authAdmin,pool)
        // se actualiza la confirmacion de la zona para la fecha de visita liberando los cupos en las zonas
        await protocolo.updateReleaseConfirm(fecha_visita,deniZones,pool,true);
        
        //console.log("REspuesta ",response)

        //creamos un vector respuesta para enviar al front con lo objetos resultantes
        const respuesta =[];
        if(response){
            // Denegamos la entrada a cada una de las zonas, de la solicitud Rechazada
            
            console.log(`\n-> DENY ---> deny: ${id_solicitud} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);
            
            const client = await pool.connect();
               await zonasSolicitadas.forEach(async({id_zona},index) => {
                    try{
                        const queryText = "INSERT into det_sol_zona (id_solicitud,id_zona,permiso) VALUES($1,$2,'Denied') returning *";
                        const val =[id_solicitud,id_zona]
                        const resp = await client.query(queryText,val);
                        
                        if (resp.rowCount < 1) {
                            console.log(`Error (404) Not deny request id:  ${id_solicitud} zone : ${id_zona}`);
                            respuesta.push({
                                ok: false,
                                message: `Cann´t deny request with id: ${id_solicitud} zone : ${id_zona}`,
                            })
                            
                        } else {
                            console.log(`Success (200) request deny id: ${id_solicitud} zone: ${id_zona}`);
                            
                            respuesta.push({
                                ok: true,
                                alert: `Request deny id: ${id_solicitud} zone ${id_zona}`,
                                data: resp.rows
                            })
                        }
                        
                        if(index == zonasSolicitadas.length - 1){
                            //enviamos correo al usuario informado sobre el rechazo de la solicitud
                            plugins.mail.mail_send.sendTheMail(null, reqJson, "Rejected",null);
                            return res.status(200).json({
                                respuesta:respuesta
                            })
                        }
                    }catch(e){
                        console.log("Error ",e)
                        return res.status(400).json(
                            { ok:false, data: 'error en query '}
                            
                        );

                    }
                    
                })
                client.release();
                
                
        }else{
            return res.status(400).json({ ok:false, data: 'error en query '});
        }
        

    }catch(err){
        return res.status(400).json({ ok: false, data: 'error en query  -> ' + err });
    }
    
    
};