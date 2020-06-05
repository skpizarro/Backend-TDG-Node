const Pool = require('pg').Pool;
const config = require('../config');
const socket = require('../plugins/socketio/socket')

const confDb = {
    connectionString: 'postgressql://postgres:superuser@localhost:5432/protocolo_zonas_granja'
}

const pool = new Pool(confDb);


//GET: /api/Visitas/:zona
exports.getVisitas = async(zona)=>{
    try{

        if(zona =="Todas"){
            const query =
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

            const client = await pool.connect();
            const resp = await client.query(query);
            client.release();

            if (resp.rows.length > 0){
                // res.status(200).send({
                //     ok:true,
                //     visitas: resp.rows
                // })
                return resp.rows
            }else{
                // res.status(400).send({
                //     ok:false,
                //     visitas: null
                // })
                return resp.rows
            }
            
        }else{
            const query =
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
            WHERE z.nombre_zona = $1
            ORDER BY v.id_visita DESC`
            const val=[zona];
            const client = await pool.connect();
            const resp = await client.query(query,val);
            client.release();

            if (resp.rows.length > 0){
                // res.status(200).send({
                //     ok:true,
                //     visitas: resp.rows
                // })
                return resp.rows
            }else{
                // res.status(400).send({
                //     ok:false,
                //     visitas: null
                // })
                return resp.rows
            }
        }
        

    }catch(e){
        console.log(`Error: ${e}`)
    }

}

exports.getVisitasByDate = async(fecha,zona)=>{
    try{
        
        if(zona =="Todas"){
            const query =
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
            WHERE v.fecha_visita =$1
            ORDER BY v.id_visita DESC`
            const val =[fecha]
            const client = await pool.connect();
            const resp = await client.query(query,val);
            client.release();

            if (resp.rows.length > 0){
                // res.status(200).send({
                //     ok:true,
                //     visitas: resp.rows
                // })
                return resp.rows
            }else{
                // res.status(400).send({
                //     ok:false,
                //     visitas: null
                // })
                return false
            }
            
        }else{
            const query =
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
            WHERE z.nombre_zona = $1 AND v.fecha_visita = $2
            ORDER BY v.id_visita DESC`
            const val=[zona,fecha];
            const client = await pool.connect();
            const resp = await client.query(query,val);
            client.release();

            if (resp.rows.length > 0){
                // res.status(200).send({
                //     ok:true,
                //     visitas: resp.rows
                // })
                return resp.rows
            }else{
                // res.status(400).send({
                //     ok:false,
                //     visitas: null
                // })
                return false
            }
        }
        
    }
    catch(e){
        console.log(e);
    }
}