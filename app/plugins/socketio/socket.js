const {io} = require('../index');
const visitas = require('../../controllers/visitasController');
const events = require('events');

const myEmitter = new events.EventEmitter();

function startSocket (io){

    io.on('connection', (socket) =>{
        console.log('Client connected: ',socket.id);
        getVisits(socket);
        getVisitsByDate(socket)
        onNewVisit(socket);
        disconnectClient(socket);
    });

}

function disconnectClient(socket){
    socket.on('disconnect', ()=>{
        console.log(`Client Disconnected: ${socket.id}`);
    })
}



function getVisits(socket){
    socket.on('getVisits',async(data)=>{
        
        const ruta = data.ruta.split("/");
        console.log("Zona ",ruta[2])
        const obj = await visitas.getVisitas(ruta[2]);
        console.log("Enviar visitas")
        socket.emit('NewVisits',{obj})
    })
    
}

function getVisitsByDate (socket){

    socket.on('getVisitsByDate',async (data)=>{
        const {fecha,ruta} = data
        console.log("Fecha ",fecha)
        //console.log("Ruta ",ruta)
        route = ruta.split('/')
        console.log("Zona ",route[2]);
        const obj = await visitas.getVisitasByDate(fecha,route[2])
        socket.emit('NewVisits',{obj})
    })
}

function onNewVisit(socket){
    myEmitter.on('newVisitRecord',(newVisit)=>{
        socket.emit('getNewVisit',newVisit)
    })
}


function sendNewVisit(newVisit){
    console.log("sendNewVisit")
    myEmitter.emit('newVisitRecord',newVisit);
}

module.exports={startSocket,sendNewVisit}

