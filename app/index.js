"use strict";

const Server = require("./server/server");
const config = require('./config');

const router_home = require("./router/index");
const router_api = require("./router/api");
const router_api_admon = require("./router/apiadmon");

const port = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;
const S3_BUCKET = config.bucket;

const server = Server.default.init(port);

server.app.use(router_api);
server.app.use(router_api_admon);
server.app.use(router_home);

server.start(() => {
    console.log('Servidor corriendo en el puerto ' + server.port);
    console.log(`>>node env:${NODE_ENV} >>bucket:${S3_BUCKET}`);
})