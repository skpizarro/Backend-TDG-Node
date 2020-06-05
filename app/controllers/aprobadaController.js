const Pool = require('pg').Pool;
const config = require('../config');
const plugins = require('../plugins');
const protocolo = require('./protocoloSolicitud');

const confDb = {
    connectionString: 'postgressql://postgres:superuser@localhost:5432/protocolo_zonas_granja'
}

const pool = new Pool(confDb);


//put('/api/adm/approve', aprobadas.approve) 
//[body.dataUser]
exports.approve = async(req, res) => {
    try{
        console.log(`\n-> PUT (approve) ${req.protocol}://${req.headers.host}${req.originalUrl} `);
        var reqJson = req.body.dataUser;
        const {id_solicitud,fecha_visita,zonasAprovadas,zonasSolicitadas,authAdmin} = reqJson;

        console.log(`Aprovadas [${zonasAprovadas}]  solicitadas ${zonasSolicitadas}`);


        // mapeamos las zonasSolcitadas para generar un nuevo array con las autorizadas y denegadas
        const promises = zonasSolicitadas.map(async({id_zona,nombre_zona})=>{
            if(!zonasAprovadas.includes(id_zona)){
                return ({id_zona:id_zona,nombre_zona:nombre_zona,permiso:"Denied"})
                
            }else{
                return ({id_zona:id_zona,nombre_zona:nombre_zona,permiso:"Authorized"})
            }
            });
    
            const reqResult = await Promise.all(promises);
            console.log("Resultado solicitud: ",reqResult)

        //Actualizarmos el estado de la solicitud
        const response = await protocolo.updateSolicitudState("Accepted",id_solicitud,authAdmin,pool);
        //Ahora liberamos los confirmados de zonas no autorizadas, se le manda false como parametro para que escoja entre las zonas unicamente denegadas 
        await protocolo.updateReleaseConfirm(fecha_visita,reqResult,pool,false);
        console.log("Respuesta ",response)

        //creamos un vector respuesta para enviar al front con lo objetos resultantes
        const respuesta=[];
        if(response){
            //Permitimos y denegamos la entrada a caad una de las zonas, de la solicitud aceptada
            console.log(`\n-> Accepted ---> Accepted: ${id_solicitud} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);

            const client = await pool.connect();
            reqResult.forEach(async({id_zona,permiso},index)=>{
                const queryText = "INSERT into det_sol_zona (id_solicitud,id_zona,permiso) VALUES($1,$2,$3) returning *"
                const val = [id_solicitud,id_zona,permiso];
                const resp = await client.query(queryText,val);
                //client.release();

                if (resp.rowCount < 1) {
                    console.log(`Error (404) Not ${permiso} request id:  ${id_solicitud} zone : ${id_zona}`);
                    respuesta.push({
                        ok: false,
                        message: `Cann´t ${permiso} request with id: ${id_solicitud} zone : ${id_zona}`,
                    })
                    
                } else {
                    console.log(`Success (200) request ${permiso} id: ${id_solicitud} zone: ${id_zona}`);
                    
                    respuesta.push({
                        ok: true,
                        alert: `Request ${permiso} id: ${id_solicitud} zone ${id_zona}`,
                        data: resp.rows
                    })
                }
                
                if(index == zonasSolicitadas.length - 1){
                    //generamos el codigo QR
                    // primero generamos el id para identificar el qr
                    let idQr = plugins.qr.qr_id_generate.generateIdQR(reqJson)
                    // luego generamos el qr con la informacion del usuario y las respectivas zonas autorizadas
                    // retornamos un objeto con el qr generado y un string de las zonas validas para usar el codigo.
                    let qrZones = await plugins.qr.qr_generate.generateQR(idQr,reqJson,reqResult);
                    
                    //enviamos correo al usuario informado sobre la solicitud aceptada con detalle
                    plugins.mail.mail_send.sendTheMail(idQr, reqJson, "Accepted",qrZones);
                    return res.status(200).json({
                        respuesta:respuesta
                    })
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




exports.specialPermission = async(req, res) => {
    try{
        console.log(`\n-> PUT (Special Permission) ${req.protocol}://${req.headers.host}${req.originalUrl} `);
        var reqJson = req.body.dataUser;
        const {id_solicitud,fecha_visita,zonasAprovadas,zonasSolicitadas,special,authAdmin} = reqJson;

        console.log(`Aprovadas para permismo especial [${zonasAprovadas}]  solicitadas ${zonasSolicitadas}`);


        // mapeamos las zonasSolcitadas para generar un nuevo array con las autorizadas y denegadas
        const promises = zonasSolicitadas.map(async({id_zona,nombre_zona})=>{
            if(!zonasAprovadas.includes(id_zona)){
                return ({id_zona:id_zona,nombre_zona:nombre_zona,permiso:"Denied"})
                
            }else{
                return ({id_zona:id_zona,nombre_zona:nombre_zona,permiso:"Authorized"})
            }
            });
    
            const reqResult = await Promise.all(promises);
            console.log("Resultado solicitud: ",reqResult)

        //Actualizarmos el estado de la solicitud
        const response = await protocolo.updateSolicitudState("Special Permission",id_solicitud,authAdmin,pool);
        //Ahora liberamos Todas , le mandamos como parametro true para que sepa que son todas las zonas
        await protocolo.updateReleaseConfirm(fecha_visita,reqResult,pool,true);
        console.log("Respuesta ",response)

        //creamos un vector respuesta para enviar al front con lo objetos resultantes
        const respuesta=[];
        if(response){
            //Permitimos y denegamos la entrada a caad una de las zonas, de la solicitud aceptada
            console.log(`\n-> Special Permission ---> Accepted: ${id_solicitud} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);

            const client = await pool.connect();
            reqResult.forEach(async({id_zona,permiso},index)=>{
                const queryText = "INSERT into det_sol_zona (id_solicitud,id_zona,permiso) VALUES($1,$2,$3) returning *"
                const val = [id_solicitud,id_zona,permiso];
                const resp = await client.query(queryText,val);
                

                if (resp.rowCount < 1) {
                    console.log(`Error (404) Not ${permiso} request id:  ${id_solicitud} zone : ${id_zona}`);
                    respuesta.push({
                        ok: false,
                        message: `Cann´t ${permiso} request with id: ${id_solicitud} zone : ${id_zona}`,
                    })
                    
                } else {
                    console.log(`Success (200) request ${permiso} id: ${id_solicitud} zone: ${id_zona}`);
                    
                    respuesta.push({
                        ok: true,
                        alert: `Request ${permiso} id: ${id_solicitud} zone ${id_zona}`,
                        data: resp.rows
                    })
                }
                
                if(index == zonasSolicitadas.length - 1){
                    //generamos el codigo QR
                    // primero generamos el id para identificar el qr con permiso especial
                    let idQr = plugins.qr.qr_id_generate.generateSpecialIdQR(reqJson)
                    // luego generamos el qr con la informacion del usuario y las respectivas zonas autorizadas
                    // retornamos un objeto con el qr generado y un string de las zonas validas para usar el codigo.
                    let qrZones = await plugins.qr.qr_generate.generateQR(idQr,reqJson,reqResult);
                    
                    //enviamos correo al usuario informado sobre la solicitud aceptada con detalle
                    plugins.mail.mail_send.sendTheMail(idQr, reqJson, "Special Permission",qrZones);
                    return res.status(200).json({
                        respuesta:respuesta
                    })
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



//Cancelar el las solicitudes aceptadas y permisos especiales.
exports.cancel = async(req, res) =>{
    try{
        const reqJson = req.body.dataUser;
        const {id_solicitud,zonasSolicitadas,fecha_visita,authAdmin,estado} = reqJson;
        
        //Creamos un array con todas las zonas y una propiedad permiso con valor denegado para todas
        const deniZones = zonasSolicitadas.map(({id_zona,nombre_zona})=>{return {id_zona,nombre_zona,permiso:'Denied'} });
        //var idQr = req.params.id;
    
        //Se Cancela permisos
        const response = await protocolo.updateSolicitudState('Canceled',id_solicitud,authAdmin,pool)
        
        // se Liberan los cupos, SOLO para las aceptadas, ya que, para los permisos especiales se liberan al momento de crearlos. 
        console.log("Estado:  ", estado)
        if(estado === 'Accepted'){
            console.log("Se han liberado las los cupos en las zonas")
            await protocolo.updateReleaseConfirm(fecha_visita,deniZones,pool,true);
        }
        

        //creamos un vector respuesta para enviar al front con lo objetos resultantes
        const respuesta =[];
        if(response){
            // Denegamos la entrada a cada una de las zonas
            
            console.log(`\n-> CANCEL ---> cancel: ${id_solicitud} :: ${req.protocol}://${req.headers.host}${req.originalUrl} `);
            
            const client = await pool.connect();
               await zonasSolicitadas.forEach(async({id_zona},index) => {
                    try{
                        const queryText = "UPDATE det_sol_zona SET permiso = 'Denied'  WHERE id_solicitud = $1 AND id_zona = $2 returning *";
                        const val =[id_solicitud,id_zona]
                        const resp = await client.query(queryText,val);
                        
                        if (resp.rowCount < 1) {
                            console.log(`Error (404) Not Cancel request id:  ${id_solicitud} zone : ${id_zona}`);
                            respuesta.push({
                                ok: false,
                                message: `Cann´t Cancel request with id: ${id_solicitud} zone : ${id_zona}`,
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
                            //enviamos correo al usuario informado sobre la cancelacion de los permisos
                            plugins.mail.mail_send.sendTheMail(null, reqJson, "Canceled",null);
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



//get('/api/adm/aprobadas', aprobadas.findAll)
exports.findAll = function (req, res) {
    console.log(`\n-> GET---> findAll ${req.protocol}://${req.headers.host}${req.originalUrl} `); //${req.path} * ${req.originalUrl}
    const queryText = `
                        SELECT
                        si.id_solicitud,
                        si.id_usuario,
                        si.estado,
                        si.motivo_Visita,
                        si.fecha_visita,
                        u.nombre_usuario,
                        u.apellido_usuario,
                        u.email_usuario,
                        tu.tipo_usuario
                        FROM solicitud_ingreso AS si 
                        JOIN usuario AS u ON si.id_usuario = u.id_usuario
                        JOIN tipo_usuario AS tu ON u.id_tipo_usuario = tu.id_tipo_usuario
                        WHERE si.estado = 'Accepted' OR si.estado = 'Special Permission'
                        ORDER BY si.id_solicitud DESC
                    `

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