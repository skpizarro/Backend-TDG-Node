"use strict";

// import express from 'express';
// import path from 'path';

const bodyParser = require('body-parser');
const express = require('express');
const path = require("path");

class Server {

    constructor(puerto) {
        this.port = puerto;
        this.app = express();
    }

    publicFolder() {
        //const publicPath = path.resolve(__dirname, '../public');
        const publicPath2 = path.join(process.cwd(), '../public');
        //this.app.use(express.static(publicPath));
        this.app.use('/static', express.static(publicPath2))
        console.log(`>>public path >>>${publicPath2}\n--http://localhost:8080/static/qr_image.png--`); //>>${publicPath}\n
    }

    static init(puerto) {
        return new Server(puerto);
    }

    start(callback) {
        this.app.listen(this.port, callback());
        //callback corre donde llamo la funcion,
        //server.start( ()=>{...run this..} )
        this.publicFolder();
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json);
    }

    static getApp() {
        return this.app;
    };
};

exports.default = Server;