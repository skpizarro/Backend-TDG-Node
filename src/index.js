"use strict";

const Server = require("./server/server");
const router = require("./router/router");

const server = Server.default.init(8080);

server.app.use(router);

server.start(()=>{
    console.log('Servidor corriendo en el puerto ' + server.port);
})