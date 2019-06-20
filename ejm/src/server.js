"use strict";

const Hapi = require("hapi");
const plugins = require("./plugins"); //sql client
const routes = require("./routes");

const app = async config => {
    const { host, port } = config; //recibo parametros enviados (config) de index.js

    // create an instance of hapi
    const server = Hapi.server({ host, port });

    // store the config for later use
    server.app.config = config;

    // register plugins
    await plugins.register(server); //client sql, views

    // register routes
    await routes.register(server); //GET, POST, ... return (datareq)?

    return server;
};

module.exports = app;