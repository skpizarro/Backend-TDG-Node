"use strict";

const Server = require("./server/server");
const router_api = require("./router/api");
const router_home = require("./router/index");

const server = Server.default.init(8080);

server.app.use(router_api);
server.app.use(router_home);

server.start(() => {
    console.log('Servidor corriendo en el puerto ' + server.port);
})