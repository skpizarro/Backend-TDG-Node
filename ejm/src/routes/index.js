"use strict";

const api = require("./api"); //result by events (index.js)

module.exports.register = async server => { // register se exporta
    // register api routes
    //lleva el metodo GET, POST (server) -> events=>(res)
    await api.register(server);
    // register authentication routes
    //    await auth.register( server );

    //homepage route
    server.route({
        method: "GET",
        path: "/", //root
        handler: async(request, h) => {
            // return "My first hapi server!";
            try {
                // const message = request.auth.isAuthenticated ? `Hello, ${ request.auth.credentials.profile.firstName }!` : "My first hapi server!";
                return `HOME ---- ${request.info.remoteAddress}`;
            } catch (err) {
                server.log(["error", "home"], err);
            }
        }
    });

    // Serve static files in the /dist folder
    server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "dist"
            }
        }
    });
};