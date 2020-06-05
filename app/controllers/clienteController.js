const Pool = require('pg').Pool;
const config = require('../config');
const plugins = require('../plugins');
const Protocolo= require('./protocoloSolicitud');

const socket = require('./../plugins/socketio/socket');


const confDb = {
    connectionString: 'postgressql://postgres:superuser@localhost:5432/protocolo_zonas_granja'
}



const pool = new Pool(confDb);



//post'/api/validateqr'
exports.validateRequest = async (req, res) =>{
    console.log(`\n-> POST ---> validate ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    
    const {Name,QRid,zone,ID} = req.body;
    const idComp = QRid.split('/');
    
    try{
        const client = await pool.connect();
        console.log("zone",zone)
        //Se valida el ingreso a la entrada principal de la granja
        if(zone == '0'){
            console.log("Entrada principal ")
            await mainEntranceValidate(Name,idComp,res,client);

        }else
        //Consultamos si en la solicitud se le autorizo un permiso especial al usuario y ademas para la zona donde se hizo la lectura
        if (idComp[1]==="SpecialPermission"){
            console.log("Special")
            let queryText = `SELECT 
            si.id_solicitud,
            si.id_usuario,
            si.estado,
            dsz.id_zona,
            dsz.permiso
            FROM solicitud_ingreso AS si
            JOIN det_sol_zona AS dsz
            ON si.id_solicitud = dsz.id_solicitud
            WHERE si.id_solicitud = $1 AND si.estado = 'Special Permission'
            AND dsz.id_zona = $2 
            AND dsz.permiso = 'Authorized'
            ` 
            let val = [idComp[0],zone]
            const resp = await client.query(queryText,val)

            if(resp.rowCount < 1){
                console.log('Error (404) USER NO AUTHORIZED ' + Name);
                    res.status(404).send({
                        ok: false,
                        message: 'No requests information found with Special Permission'
                    });
            }else{
                // se calcula la fecha actual y la hora de ingreso
                const dateTime = getDateTime();
                const {date,time} = dateTime;

                // se registra la visita en la zona
                queryText = `INSERT INTO visita(hora,id_usuario,id_zona,fecha_visita)
                            VALUES ($1,$2,$3,$4) returning*`
                val = [time,ID,zone,date]
                await client.query(queryText,val);

                //obtenemos todas las visitas
                queryText =
                `SELECT
                v.id_visita,
                u.id_usuario,
                u.nombre_usuario,
                u.apellido_usuario,
                tu.tipo_usuario,
                z.nombre_zona,
                v.hora,
                v.fecha_visita
                FROM visita AS v
                JOIN usuario AS u ON v.id_usuario = u.id_usuario
                JOIN tipo_usuario AS tu ON tu.id_tipo_usuario = u.id_tipo_usuario
                JOIN zona AS z ON z.id_zona = v.id_zona
                ORDER BY v.id_visita DESC`
                const newVisit = await client.query(queryText);
                
                /////llamamos al mentodo que se encarga de emitir el evento
                socket.sendNewVisit(newVisit.rows);


                res.status(200).send({
                    ok: true,
                    data: resp.rows
                })
            }
            

        }else{
            
            //Consultamos si la solicitud fue aceptada para la fecha y zona especifica
            let queryText =`SELECT 
            si.id_solicitud,
            si.id_usuario,
            si.estado,
            dsz.id_zona,
            dsz.permiso
            FROM solicitud_ingreso AS si
            JOIN det_sol_zona AS dsz
            ON si.id_solicitud = dsz.id_solicitud
            WHERE si.id_solicitud = $1 AND si.estado = 'Accepted'
            AND si.fecha_visita = $2
            AND dsz.id_zona = $3 
            AND dsz.permiso = 'Authorized'`
            let val =[idComp[0],idComp[1],zone];

            const resp = await client.query(queryText,val);
            
            fechaVisita = idComp[1];
            // obtenemos fecha actual
            const {time,date} =  getDateTime();

            console.log(`visit_date: ${fechaVisita} ---- current_date: ${date}`);

            if (resp.rowCount < 1 || date !== fechaVisita) {
                console.log('Error (404) USER NO ADMITED ' + Name);
                res.status(404).send({
                    ok: false,
                    message: 'No requests information found or Date error: ' + fechaVisita + ' T: ' + date,
                });
            } else {
                console.log("Accepted")
                console.log('Success (200) USER ADMITED ' + Name);


                // se registra la visita en la zona
                queryText = `INSERT INTO visita(hora,id_usuario,id_zona,fecha_visita)
                            VALUES ($1,$2,$3,$4) returning*`
                val = [time,ID,zone,date]
                await client.query(queryText,val);

                //obtenemos todas las visitas
                queryText =
                `SELECT
                v.id_visita,
                u.id_usuario,
                u.nombre_usuario,
                u.apellido_usuario,
                tu.tipo_usuario,
                z.nombre_zona,
                v.hora,
                v.fecha_visita
                FROM visita AS v
                JOIN usuario AS u ON v.id_usuario = u.id_usuario
                JOIN tipo_usuario AS tu ON tu.id_tipo_usuario = u.id_tipo_usuario
                JOIN zona AS z ON z.id_zona = v.id_zona
                ORDER BY v.id_visita DESC`
                const newVisit = await client.query(queryText);
                
                /////llamamos al mentodo que se encarga de emitir el evento
                socket.sendNewVisit(newVisit.rows);



                res.status(200).send({
                    ok: true,
                    data: resp.rows
                });
            }
        }
        client.release();

    }catch(err){
        console.log(`error conectando db, path: ${req.path} ` + err);
        return res.status(500).json({ success: false, data: err });
    }
    
};


const getDateTime =()=>{
    try{
        
        const d = new Date();
        const day = d.getDate();
        const month = d.getMonth() + 1; // el mes se maneja como vector entonces se le suma 1
        const year = d.getFullYear();
        const h = d.getHours();
        const m = d.getMinutes();
        let date=""
        let time =""

        if(month <10 && day <10){
            date = `${year}-0${month}-0${day}`
        }else if(month <10){
            date = `${year}-0${month}-${day}`
        }else if(day <10){
            date = `${year}-${month}-0${day}`
        }else{
            date = `${year}-${month}-${day}`
        }
    
        if(h <10 && m <10){
            time = `0${h}:0${m}`
        }else if(h <10){
            time = `0${h}:${m}`
        }else if(m <10){
            time = `${h}:0${m}`
        }else{
            time = `${h}:${m}`
        }
        
        
        
        
        const dateTime = {'date':date,'time':time}

        console.log("datetime",dateTime)

        return dateTime;
         

    }catch(e){
        console.log("Error al generar hora y fecha - ",e);
    }
    
}

const mainEntranceValidate = async(Name,idComp,res,client)=>{
    let queryText=""
    if (idComp[1] === "SpecialPermission"){
        queryText = `SELECT 
        id_solicitud,
        id_usuario,
        estado
        FROM solicitud_ingreso
        WHERE id_solicitud = $1 AND estado = 'Special Permission'` 
        let val = [idComp[0]]
        const resp = await client.query(queryText,val)
        
        if(resp.rowCount < 1){
            
            console.log('Error (404) USER NO AUTHORIZED ' + Name);
                res.status(404).send({
                    ok: false,
                    message: 'No requests information found with Special Permission'
                });
        }else{
            res.status(200).send({
                ok: true,
                data: resp.rows
            })

        }
    }else{
        //Consultamos si la solicitud fue aceptada para la fecha 
    queryText =`SELECT 
    id_solicitud,
    id_usuario,
    estado
    FROM solicitud_ingreso 
    WHERE id_solicitud = $1 AND estado = 'Accepted' AND fecha_visita = $2`
    
    dateTime = getDateTime();
    const {date} = dateTime;

    let val =[idComp[0],date];

    const resp = await client.query(queryText,val);
    
    if (resp.rowCount < 1 ) {
        console.log('Error (404) USER NO ADMITED ' + Name);
        res.status(404).send({
            ok: false,
            message: 'No requests information found or Date error: ' + idComp[1],
        });
    } else {
        console.log('Success (200) USER ADMITED ' + Name);
        res.status(200).send({
            ok: true,
            data: resp.rows
        });
    }
    }
    
}


//POST'/api/SolicitudIngreso'
exports.createRequest = async (req, res) =>{
    console.log(`\n-> POST --> generate ${req.protocol}://${req.headers.host}${req.originalUrl} `);
    var reqJson = req.body;
        try {
            const client = await pool.connect();
                    
                    const { nombre, apellido, cedula, email, tipoPersona, fecha, motivoVisita } = reqJson.user;
                    
                    /// capacidad de prueba
                    const cap = 5;
                    
                    const estado = 'Pendiente';

                const resp = await Protocolo.procesarSolicitud(client, cedula,
                            nombre,
                            apellido,
                            email,
                            tipoPersona,
                            fecha,
                            motivoVisita,
                            estado, cap);
                client.release();
            if (resp) {
                //const result = insertSolicitud();  
                return res.status(200).send({
                    ok: true,
                    data: "Su solicitud está en trámite de aprobación, por favor esté pendiente de su correo electrónico."
                });

            } else {
                    return res.status(200).send({
                        ok: false,
                        data: "Error: El usuario no puede generar más de una solicitudo para la misma fecha"
                    }); 
            }

        } catch (e) {
            console.log(`error conectando db, path: ${req.path} ` + e);
            return res.status(500).json({ ok: false, data: "No se genera la solicitud" });
        }
};