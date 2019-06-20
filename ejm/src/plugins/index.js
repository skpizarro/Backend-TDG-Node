"use strict";
// const auth = require( "./auth" );

const ejs = require("ejs");
const inert = require("inert");
const { join } = require("path");
const vision = require("vision");
const sql = require("./sql");

//client DB to run queries from other parts of the app (FMW MIDDLEWARE)
module.exports.register = async server => {
    // register plugins
    await server.register([inert, sql, vision]);
    // configure ejs view templates
    const filePath = join(process.cwd(), "src");

    server.views({
        engines: { ejs },
        relativeTo: filePath,
        path: "views",
        layout: true
    });

    // register authentication plugins (falta -> src/plugins/auth.js)
    //await auth.register( server );
};