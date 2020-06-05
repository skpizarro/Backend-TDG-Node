"use strict";

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http'); // nos permite levantar el servidor, socketio no se trabaja directo con express, express esta basado en http

//const path = require("path");

class Server {

    constructor(puerto) {
        this.port = puerto;
        this.app = express();
        //Definimos el servidor donde corremos la aplicacion
        this.server = http.createServer(this.app)
    }


    static init(puerto) {
        return new Server(puerto);
    }
    
    

    start(callback) {
        this.server.listen(this.port, callback());// no se usa app
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json);
    }
};

exports.default = Server;