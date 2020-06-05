//consultar usuario
const getUser = async(client, cedula) => {
    try {
        // primero verificamos si el usuario existe en la base de datos
        const queryUser = `SELECT id_usuario FROM usuario WHERE id_usuario = $1`
        const resp = await client.query(queryUser, [cedula]);
        //client.release();
        return (resp.rows.length);
    } catch (e) {
        console.log(e);
    }
}

//crear usuario
const createUser = async(client, cedula, nombre, apellido, email, tipoPersona) => {
    try {
        const queryIns = `INSERT INTO usuario(id_usuario,nombre_usuario,apellido_usuario,email_usuario,id_tipo_usuario) VALUES($1,$2,$3,$4,$5) returning *`
        const val = [cedula, nombre, apellido, email, tipoPersona]
        const resp = await client.query(queryIns, val);
        //client.release();
        console.log("creamos el usuario ", resp.rows);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

//consultar agenda
const getAgenda = async(client, fecha) => {
        try {
            const queryAgenda = `SELECT fecha FROM agenda_visita WHERE id_fecha = $1`
            const val = [fecha]
            const resp = await client.query(queryAgenda, val);
            //client.release();
            return (resp.rows.length)
        } catch (e) {
            console.log(e);
        }
    }
    //agedar fecha
const agendarFecha = async(client, fecha) => {
    try {
        const query = `INSERT INTO agenda_visita(id_fecha,fecha) VALUES($1,$1) returning *`
        const val = [fecha];
        resp = await client.query(query, val);
        //client.release();
        return resp;
    } catch (e) {
        console.log(e);
        return e;
    }
}

//Recorrer Motivo visita para cambiar el estado
const setConfirmarCapFech = (client, fecha, cap, motivoVisita, estado, cedula) => {
    try {
        let count = 0;
        motivoVisita.forEach(z => {
            //console.log("zona  ", z)
                //Con este ciclo recorremos las motivo visita y confirmamos
            const initialQuery = `SELECT confirmados FROM det_zona_capacidadxfecha  WHERE id_zona = $1 AND id_fecha= $2`
            const val = [z, fecha]
            const resp = client.query(initialQuery, val).then(resp => {
                
                if (resp.rows.length == 0) {

                    console.log(`No hay visitas en zona ${z}, se confirma la primera`);
                        // significa que no hay visitas aun para esta fecha , insertamos iniciando confirmados en 1
                    const query = "INSERT INTO det_zona_capacidadxfecha (confirmados,id_zona,id_fecha) VALUES($1,$2,$3) returning *";
                    const val = [1, z, fecha];
                    const resp = client.query(query, val);
                    console.log("confirmados = 1 ");
                    if (count == 0) {
                        insertSolicitud(client, fecha, estado, motivoVisita, cedula);
                        count++;
                    }
                } else {

                    console.log(`Ya hay ${resp.rows[0].confirmados} visitas confirmadas en zona ${z}, se confirma la nueva visita`)
                    const query = `UPDATE det_zona_capacidadxfecha SET confirmados= $1  WHERE id_zona =$2 AND id_fecha= $3`;
                    const newconfirm = resp.rows[0].confirmados + 1
                    const val = [newconfirm, z, fecha]
                    client.query(query, val);
                    console.log(`Nuevos confirmados ${newconfirm}`);
                    if (count == 0) {
                        insertSolicitud(client, fecha, estado, motivoVisita, cedula);
                        count++;
                    }

                }
                //client.release();

            });


        });


    } catch (e) {
        console.log(e);
        return false;
    }
}

// Consultar si el susuario ya tiene una solicitud con la misma fecha
const getFechaSolIngUs = async(client, cedula, fecha) => {
    try {
        const query = `SELECT * FROM solicitud_ingreso WHERE id_usuario = $1 AND fecha_visita = $2`
        const val = [cedula, fecha];
        const resp = await client.query(query, val);
        //client.release();
        return (resp.rows.length);
    } catch (e) {
        console.log(e);

    }
}

//Insert Solicitud
const insertSolicitud = async(client, fecha, estado, motivoVisita, cedula) => {
    try {
        const query = `INSERT INTO solicitud_ingreso(fecha_visita,estado,motivo_visita,id_usuario) VALUES($1,$2,$3,$4) returning *`;
        const val = [fecha, estado, motivoVisita, cedula];
        resp = await client.query(query, val);
        //client.release();
        console.log("Solicitud creada");
        return true;

    } catch (e) {
        console.log("No se crea la solicitud ", e);
        return false;
    }
}

const procesarSolicitud = async(client, cedula, nombre, apellido, email, tipoPersona, fecha, motivoVisita, estado, cap) => {
    console.log(`Info solicitud: Fecha ${fecha}, Zonas [${motivoVisita}]`);
    //var respuesta;
    try {

        //consultamos si el usuario existe
        var resp = await getUser(client, cedula);

        if (resp == 0) {
            //Como no existe
            //creamos usuario
            resp = await createUser(client, cedula, nombre, apellido, email, tipoPersona);
            //consultamos si la fecha ya esta agendada
            resp = await getAgenda(client, fecha);
            if (resp > 0) {
                console.log(`Visitas para la fecha ${fecha} ya existe en la agenda`);
                //la fecha ya estaba agendada y con capacidad
                // recorremos el array y confirmamos la asistencia en la zona para la fecha especifica
                respuesta = setConfirmarCapFech(client, fecha, cap, motivoVisita, estado, cedula);
            } else {

                //se agenda visita en la fecha
                resp = await agendarFecha(client, fecha);
                console.log(`Se agenda visita para la fecha: ${fecha}`);

                respuesta = setConfirmarCapFech(client, fecha, cap, motivoVisita, estado, cedula);

            }
            
        return true;
        } else {
            //Como el usuario si existe y la fecha ya esta agendada
            //validamos si tiene una solicitud con la misma fecha
            
            resp = await getFechaSolIngUs(client, cedula, fecha);
            //validamos solicitud con misma fecha
            if (resp == 0) {
                // el usuario no tiene solicitud para la misma fecha
                //consultamos si la fecha ya esta agendada
                resp = await getAgenda(client, fecha);
                if (resp > 0) {
                    //la fecha ya estaba agendada y con capacidad
                    // recorremos el array y confirmamos la asistencia en la zona para la fecha especifica
                    console.log(`Visitas para la fecha ${fecha} ya existe en la agenda`);

                    respuesta = setConfirmarCapFech(client, fecha, cap, motivoVisita, estado, cedula);
                   
                } else {
                    //se agenda la fecha
                    resp = await agendarFecha(client, fecha);
                    console.log(`Se agenda visita para la fecha: ${fecha}`);
                    // recorremos el array y confirmamos la asistencia en la zona para la fecha especifica

                    respuesta = setConfirmarCapFech(client, fecha, cap, motivoVisita, estado, cedula);
                    
                }
            
            return true;
            } else {
                console.log("El usuario no puede generar más de una solicitud para la misma fecha");
                return false;
            }
            
            
        }
    } catch (e) {
        console.log(e)
        return "Error",e;
    }

};

//Consutar tipo usuario
const getTipoUsuario = async(client) => {
    const query = "SELECT * FROM tipo_usuario;"
    return await client.query(query);
};

//Consultar disponibilidad de zona por fecha
const getZonaDispxfecha = async(client, fecha) => {
    const query = `SELECT det_zona_capacidadxfecha.id_zona,zona.nombre_zona,det_zona_capacidadxfecha.confirmados
                    FROM det_zona_capacidadxfecha
                    INNER JOIN zona ON det_zona_capacidadxfecha.id_zona=zona.id_zona
                    WHERE det_zona_capacidadxfecha.id_fecha = $1 AND det_zona_capacidadxfecha.confirmados <= 5`;
    const val = [fecha];
    const query2 = "SELECT id_zona, nombre_zona FROM zona";
    resp = await client.query(query, val);

    if (resp.rows.length == 0) {
        //Significa que todas las zonas estan disponibles (Sin confirmar) entonces traemos todas las zonas de la base de datos
        resp = await client.query(query2);
        return resp.rows
    } else {
        if (resp.rows.length > 0) {
            
            //console.log("Antes de hacer el map")
            const respConfirm= resp.rows;
            const respRows = await resp.rows.map(({id_zona,confirmados})=> id_zona);
            console.log("confirmados ",respConfirm)
            //significa que hay almenos 1 zona confirmada para esa fecha
            //ahora vamos a comparar la respuesta de los confirmados con las zonas que no estan confirmadas en la fecha , para incluirlas
            resp2 = await client.query(query2);
            
            console.log("consulta zonas",resp2.rows);
            resp2.rows.map(({id_zona:z,nombre_zona})=>{
                //console.log("EStoy recorriendo las zonas");
                if(respRows.includes(z)){
                    // ya se encuentra confirmada la zona, 
                    
                    console.log("Confirmada zona ",z)
                }else{
                    //como aun no esta confirmada la zona, se añade como nueva con 0 confirmados, osea totalmente disponible para la fecha
                    //pero si hay alguna
                    console.log("Zona sin confirmar ",z);
                    respConfirm.push({id_zona: z, nombre_zona: nombre_zona, confirmados:0})
                }
            })
            //client.release();
            //No tenemos en cueta las zonas que estan llenas y mandamos las que aun tienen capacidad
            const respConfirmTotal=[]
             respConfirm.forEach(({id_zona,nombre_zona,confirmados})=>{
                if(confirmados != 5){
                    respConfirmTotal.push({ id_zona: id_zona, nombre_zona:nombre_zona, confirmados:confirmados})
                }
            })

            
            console.log("Completado");
            return respConfirmTotal
        }
    }
}

const updateSolicitudState = async(value,id_solicitud,authAdmin,pool)=>{
    try{
     
     const queryText = 'UPDATE solicitud_ingreso SET estado = $1, id_administrador = $3 WHERE id_solicitud = $2 returning *';
     const val =[value,id_solicitud,authAdmin];
 
     const client = await pool.connect()
     const response = await client.query(queryText,val)
     client.release()
     if (response.rowCount < 1) {
         console.log(`Error (404) Not ${value} request id:  ${id_solicitud}`);
         
         return {ok:false,error:"Error Query"}
     } else {
         console.log(`Success (200) request ${value} id:   ${id_solicitud}`);
         return true
     }   
     
     
     }catch(e){
         return ({ ok: false, data: 'error en query ' + queryText + ' -> ' + e });   
     }
 
 }
 
 const updateReleaseConfirm = async(fecha,zonas,pool,flag)=>{
     try{
        const queryText = `update det_zona_capacidadxfecha 
        set confirmados =(select confirmados from det_zona_capacidadxfecha where id_zona = $1 AND id_fecha = $2)-1 
        where id_zona = $1 AND id_fecha = $2`
        const client = await pool.connect();
        
         // Libera unicamente las zonas denegadas
         if(!flag){
            await zonas.forEach(async({id_zona,permiso},index)=>{
                if(permiso === 'Denied'){
                   const val =[id_zona,fecha];
                   await client.query(queryText,val)
                   if(index == zonas.length-1){
                       return true;
                   }
                }
            })
         }else{
            console.log("Fecha ; ",fecha);
             //para las solicitudes rechazadas se liberan todos los cupos en las zonas
             // tambien Se liberan todas las zonas ya que es para un permiso especial y no debe ocupar una visita 
             await zonas.forEach(async({id_zona,permiso},index)=>{
                   const val =[id_zona,fecha];
                   await client.query(queryText,val)
                   if(index == zonas.length-1){
                       return true;
                   }
            })
         }
         

         
     }
     catch(e){
         console.log("Error ", e)
         return false;
     }
 }



module.exports = { getTipoUsuario, getZonaDispxfecha,procesarSolicitud,updateSolicitudState,updateReleaseConfirm}

