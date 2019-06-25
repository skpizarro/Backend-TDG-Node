"use strict";

const bodyParser = require('body-parser');
const express = require('express');
//const path = require("path");

class Server {

    constructor(puerto) {
        this.port = puerto;
        this.app = express();
    }

    // publicFolder() {
    //     if (process.env.NODE_ENV === 'production') {
    //         var publicPath2 = path.join(process.cwd(), './public');
    //     } else {
    //         var publicPath2 = path.join(process.cwd(), '../public');
    //     }
    //     this.app.use('/static', express.static(publicPath2))
    //     console.log(`>>public path >>>${publicPath2}`);
    // }

    static init(puerto) {
        return new Server(puerto);
    }

    start(callback) {
        this.app.listen(this.port, callback());
        //this.publicFolder();
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json);
    }
};

exports.default = Server;