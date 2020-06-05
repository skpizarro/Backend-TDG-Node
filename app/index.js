"use strict";

const Server = require("./server/server");
const config = require('./config');
const socketIO = require('socket.io');

const routes_home = require("./routes/index");
const routes_api = require("./routes/api");
const routes_api_solicitudes = require("./routes/apiSolicitudes");
const routes_api_aprobadas = require("./routes/apiAprobadas");
const routes_api_admin = require("./routes/apiAdmin");
const routes_api_visitas = require("./routes/apiVisitas");
const socket = require('./plugins/socketio/socket');


const port = process.env.PORT || 8080;

const server = Server.default.init(port);

//Inicializamos el Socket, Esta es la Comunicacion del backend
var io = socketIO(server.server);
//require('./plugins/socketio/socket')(io);
socket.startSocket(io);

server.app.use(routes_api);
server.app.use(routes_api_solicitudes);
server.app.use(routes_api_aprobadas);
server.app.use(routes_api_admin);
server.app.use(routes_home);
server.app.use(routes_api_visitas);

server.start(() => {
    console.log('Servidor corriendo en el puerto ' + server.port);
    })