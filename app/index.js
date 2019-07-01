"use strict";

const Server = require("./server/server");
const router_api = require("./router/api");
const router_home = require("./router/index");
const dotenv = require("dotenv");
dotenv.config();
// read in the .env file

const port = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;
const S3_BUCKET = process.env.S3_BUCKET;

const server = Server.default.init(port);

server.app.use(router_api);
server.app.use(router_home);

server.start(() => {
    console.log('Servidor corriendo en el puerto ' + server.port);
    console.log(`>>node env:${NODE_ENV} >>bucket:${S3_BUCKET}`);
})