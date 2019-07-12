"use strict";

const Server = require("./server/server");
const config = require('./config');

const routes_home = require("./routes/index");
const routes_api = require("./routes/api");
const routes_api_admon = require("./routes/apiadmon");

const port = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;
const S3_BUCKET = config.bucket;

const server = Server.default.init(port);

server.app.use(routes_api);
server.app.use(routes_api_admon);
server.app.use(routes_home);

server.start(() => {
    console.log('Servidor corriendo en el puerto ' + server.port);
    console.log(`>>node env:${NODE_ENV} >>bucket:${S3_BUCKET}`);
})